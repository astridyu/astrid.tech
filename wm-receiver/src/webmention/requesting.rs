use chrono::{DateTime, NaiveDateTime, Utc};
use rocket::response::status::BadRequest;
use std::{collections::HashSet, fmt::Display};
use url::Url;

use crate::schema::requests;

#[derive(Debug, PartialEq, Eq)]
pub enum MentionRequestError<'a> {
    InvalidURL(&'a str),
    UnknownTargetHost(String),
}

#[inline(always)]
fn validate_url(
    url: &'a str,
    allowed_target_hosts: Option<&HashSet<String>>,
) -> Result<(), MentionRequestError<'a>> {
    let parsed = Url::parse(url).map_err(|_| MentionRequestError::InvalidURL(url))?;

    if !(parsed.scheme() == "http" || parsed.scheme() == "https") {
        Err(MentionRequestError::InvalidURL(url))?;
    }

    // If a set of allowed hosts is provided
    if let Some(host_set) = allowed_target_hosts {
        let host = parsed.host().ok_or(MentionRequestError::InvalidURL(url))?;
        let host = host.to_string();
        if !host_set.contains(&host) {
            Err(MentionRequestError::UnknownTargetHost(host))?;
        }
    }

    Ok(())
}

pub fn create_mention(
    allowed_target_hosts: &HashSet<String>,
    source_url: &'a str,
    target_url: &'a str,
    sender_ip: &'a str,
    processing_status: i32,
    mentioned_on: DateTime<Utc>,
) -> Result<WebmentionRequest<'a>, MentionRequestError<'a>> {
    validate_url(source_url, None)?;
    validate_url(target_url, Some(allowed_target_hosts))?;

    let mentioned_on = mentioned_on.naive_utc();
    Ok(WebmentionRequest {
        source_url,
        target_url,
        sender_ip,
        processing_status,
        mentioned_on,
    })
}

impl<'a> Display for MentionRequestError<'a> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            MentionRequestError::InvalidURL(url) => write!(f, "Invalid URL: {}", url),
            MentionRequestError::UnknownTargetHost(host) => {
                write!(f, "Unknown host for target param: {}", host)
            }
        }
    }
}

impl<'a> Into<BadRequest<String>> for MentionRequestError<'a> {
    fn into(self) -> BadRequest<String> {
        BadRequest(Some(self.to_string()))
    }
}

#[derive(Insertable, Debug)]
#[table_name = "requests"]
pub struct WebmentionRequest<'a> {
    source_url: &'a str,
    target_url: &'a str,
    sender_ip: &'a str,
    processing_status: i32,
    mentioned_on: NaiveDateTime,
}

#[cfg(test)]
mod tests {
    use std::{assert_matches::assert_matches, collections::HashSet};

    use chrono::Utc;

    use crate::webmention::requesting::{create_mention, MentionRequestError};

    fn get_config() -> HashSet<String> {
        vec![
            "allowed.example.com".to_string(),
            "another.example.com".to_string(),
        ]
        .into_iter()
        .collect()
    }

    #[test]
    fn request_allowed_host_should_pass() {
        let now = Utc::now();
        let hosts = get_config();
        let source = "https://someone.example.net/their/article";
        let target = "https://allowed.example.com/our/article";
        let sender = "1.2.3.4";

        let result = create_mention(&hosts, source, target, sender, 0, now).unwrap();

        assert_eq!(result.target_url, target)
    }

    #[test]
    fn request_unknown_host_should_error() {
        let now = Utc::now();
        let hosts = get_config();
        let source = "https://someone.example.net/their/article";
        let target = "https://facebook.com/our/article";
        let sender = "1.2.3.4";

        let result = create_mention(&hosts, source, target, sender, 0, now);

        assert_matches!(result, Err(MentionRequestError::UnknownTargetHost(..)));
    }

    #[test]
    fn request_invalid_protocol_should_error() {
        let now = Utc::now();
        let hosts = get_config();
        let source = "gopher://someone.example.net/their/article";
        let target = "https://allowed.example.com/our/article";
        let sender = "1.2.3.4";

        let result = create_mention(&hosts, source, target, sender, 0, now);

        assert_matches!(result, Err(MentionRequestError::InvalidURL(..)));
    }
}
