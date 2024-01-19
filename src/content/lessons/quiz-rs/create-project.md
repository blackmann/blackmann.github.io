---
title: Create project ft. cargo workspaces
pubDate: 5 Jan 2024
index: 10
time: 2
related_commit: https://github.com/blackmann/learn-rust/commit/f14820ed7ba18f9993e3c81b98452b7464457150
---

> <span class="text-secondary">Before you continue</span>: If you haven't already, you should have Rust installed. Make some Google search 🤷🏽‍♂️.

Create a directory to keep our project. Since we're learning Rust, I propose we create a workspace[^1] so we can put all learning projects in there.

[^1]: Read about cargo workspaces [here](https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html)

Note that we don't need to use workspaces. This is just anticipating future exercises you do — so you don't clutter your file system with lots of folders. Let's go.

```bash
# you can name the directory anything you want. eg. rustws
mkdir learn-rust
cd learn-rust
```

Next is to add a manifest file to the folder: `Cargo.toml`

```toml
[workspace]
members = [
  "quiz"
]
resolver = "2"
```

Let's add the `quiz` package to the workspace.

```bash
cargo new quiz --bin
```

If you didn't add `quiz` to `workspace.members` before running this command, you get a helpful message suggesting you do so. That's one beauty of Rust. Error messages are very useful and mostly give hints on how to resolve them.

## Run

To run our `quiz` binary, do:

```bash
cargo run -p quiz
```

From now onwards, when I say let's run the app, this is the command to run.

The folder structure should look like this:

```bash
.
├── Cargo.lock
├── Cargo.toml
└── quiz
    ├── Cargo.toml
    └── src
        └── main.rs
```
