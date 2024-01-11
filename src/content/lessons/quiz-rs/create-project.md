---
title: Create project ft. cargo workspaces
pubDate: 5 Jan 2024
index: 10
---

> <span class="text-secondary">Before you continue</span>: If you haven't already, you should have Rust installed. Make some Google search 🤷🏽‍♂️.

Create a directory to keep our project. Since we're learning Rust, I propose we create a workspace[^1] so we can put all learning projects in there.

[^1]: Read about cargo workspaces [here](TODO:)

Note that we don't need to use workspaces. This is just anticipating future exercises you do — so you don't clutter your file system with lots of folders. Let's go.

```bash
# you can name the directory anything you want. eg. rustws
mkdir cargows
cd cargows
```

Next is to add a manifest file to the folder: `Cargo.toml`

```toml
[workspace]
members = [
  "quiz"
]
resolver = "2"
```

You can see `quiz` in there. Let's add it:

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