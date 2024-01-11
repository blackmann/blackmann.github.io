---
title: Test
pubDate: 10 Jan 2024
index: 20
---

We need a way to tell that what we've been writing so far is correct. Testing is straightforward in Rust. We don't need to create a separate test file. Right at the bottom of `quiz/src/quiz.rs`, add the following:

```rust
#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_question_is_answered() {
    let q = Question {
      title: String::from("Is this a question?"),
      answer: true,
      user_answer: Some(true)
    };

    assert_eq!(q.is_answered(), true);
  }

  #[test]
  fn test_question_is_correct() {
    let q = Question {
      title: String::from("Is this a question?"),
      answer: true,
      user_answer: Some(true)
    };

    assert_eq!(q.is_correct(), true);
  }
}
```

Read more about testing in Rust [here](https://doc.rust-lang.org/book/ch11-01-writing-tests.html).

To run the tests, do:

```bash
cargo test -p quiz
```

## That's not all, exercise

Surely, those two tests are not enough. Implement additional tests to cover:

- Moving to next question
- Moving to previous question
- Answering a question
- Counting score