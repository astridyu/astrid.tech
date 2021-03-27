use std::ops::Add;

use chrono::{Datelike, Duration, FixedOffset, NaiveDate, NaiveDateTime};

use crate::mapper::ShortCode::{Blog, Project, Text};
use crate::mapper::ShortCodeParseError::{EmptyString, SXGError, TooLong, UnsupportedType};
use crate::newbase60::sxg_to_num;

#[derive(Debug, Clone, PartialEq, Eq)]
enum ShortCode<'a> {
    Blog(i32, u32, u32),
    Text(i32, u32, u32, u32),
    Project(&'a str),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ShortCodeParseError {
    EmptyString,
    InvalidDate,
    SXGError,
    TooLong,
    UnsupportedType,
}

fn days_after_epoch(n: i64) -> NaiveDate {
    NaiveDate::from_yo(1970, 1).add(Duration::days(n))
}

impl ShortCode<'_> {
    fn parse(shortcode: &'a str) -> Result<ShortCode<'a>, ShortCodeParseError> {
        if shortcode.len() > 12 {
            return Err(ShortCodeParseError::TooLong);
        }

        let code_type = match shortcode.chars().next() {
            Some(c) => c,
            None => return Err(ShortCodeParseError::EmptyString),
        };

        match code_type {
            'b' => {
                let number = match sxg_to_num(&shortcode[1..]) {
                    Some(n) => n,
                    None => return Err(SXGError),
                };

                let date = days_after_epoch(number as i64);
                Ok(Blog(date.year(), date.month(), date.day()))
            }
            't' => {
                let number = match sxg_to_num(&shortcode[1..]) {
                    Some(n) => n,
                    None => return Err(SXGError),
                };

                let epoch_days = (number / 60) as i64;
                let ordinal = (number % 60) as u32;
                let date = days_after_epoch(epoch_days);
                Ok(Text(date.year(), date.month(), date.day(), ordinal))
            }
            'p' => Ok(Project(&shortcode[1..])),
            _ => Err(ShortCodeParseError::UnsupportedType),
        }
    }

    fn expand(&self) -> String {
        match self {
            Blog(y, m, d) => {
                format!("{}/{:0>2}/{:0>2}/", y, m, d)
            }
            Text(y, m, d, n) => {
                format!("{}/{:0>2}/{:0>2}/{}/", y, m, d, n)
            }
            Project(p) => {
                format!("projects/{}/", p)
            }
        }
    }
}

pub fn expand_shortcode(shortcode: &str) -> Result<String, ShortCodeParseError> {
    let parsed = ShortCode::parse(shortcode)?;
    Ok(parsed.expand())
}

#[cfg(test)]
mod tests {
    use crate::mapper::*;
    use rstest::rstest;

    #[rstest(input, expected)]
    #[case("pfoob", Project("foob"))]
    #[case("t4MYA", Text(2012, 12, 18, 10))]
    #[case("b4MY", Blog(2012, 12, 18))]
    fn parses_codes(input: &str, expected: ShortCode) {
        let code = ShortCode::parse(input).unwrap();
        assert_eq!(code, expected)
    }

    #[rstest(code, expected)]
    #[case(Blog(2021, 3, 28), "2021/03/28/")]
    #[case(Text(2021, 3, 28, 9), "2021/03/28/9/")]
    #[case(Project("masdf"), "projects/masdf/")]
    fn expands_codes(code: ShortCode, expected: &str) {
        assert_eq!(code.expand(), expected.to_string())
    }

    #[test]
    fn does_not_parse_empty_codes() {
        assert_eq!(ShortCode::parse(""), Err(EmptyString))
    }

    #[test]
    fn does_not_parse_long_codes() {
        assert_eq!(ShortCode::parse("sfd8977f879978sdf}"), Err(TooLong))
    }

    #[test]
    fn does_not_parse_unsupported_types() {
        assert_eq!(ShortCode::parse("f32"), Err(UnsupportedType))
    }
}
