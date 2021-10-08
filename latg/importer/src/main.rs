#![feature(decl_macro)]
#![feature(proc_macro_hygiene)]
#![feature(in_band_lifetimes)]
#![feature(assert_matches)]

#[macro_use]
extern crate serde;

pub mod file_schema;

fn main() {
    println!("Hello, world!");
}
