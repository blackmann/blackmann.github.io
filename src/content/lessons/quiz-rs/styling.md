---
title: Styling
pubDate: 10 Jan 2024
index: 40
time: 5
related_commit: https://github.com/blackmann/learn-rust/commit/6b18b2ce7e42236cf28d507eb535bc6ce70e4494
---

Right now our app has the same font size all round. The true/false buttons don't show any selection state — and they look small.

Styling in `egui` is a little bit odd but nothing is stopping us now.

## Font size

Let's change the overall font size of our application first. We do this in `App::update`:

```rust
fn update(&mut self, ctx: &eframe::egui::Context, frame: &mut eframe::Frame) {
  egui::CentralPanel::default().show(ctx, |ui| {
    // put styling at the top of this lambda

    let mut style = (*ctx.style()).clone();

    style.text_styles = [
        (egui::TextStyle::Body, egui::FontId::proportional(18.0)),
        (egui::TextStyle::Button, egui::FontId::proportional(18.0)),
    ]
    .into();

    style.spacing.button_padding = egui::Vec2::new(10.0, 5.0);

    ui.set_style(style);

    // ...
    // previous block of code
  });
}
```

The code you see above is from referencing the docs on how to change `text_styles`. See [`Styles.text_styles`](https://docs.rs/egui/latest/egui/style/struct.Style.html#structfield.text_styles). If you remember, from the [GUI](gui#documentation) chapter, I mentioned that a lot of Rust libraries have their documentation in the form of examples.

Let's also update just the question label so it appears bigger than `18.0` points:

```rust
ui.label(
  egui::RichText::new(current_question.title.as_str())
                    .font(egui::FontId::proportional(32.0)),
);
```


## Buttons

The buttons don't have any visual state for when they're selected. Add the following function at the very bottom of `main.rs`:

```rust
fn get_button(label: &str, selected: bool) -> egui::Button<'static> {
    let mut label = egui::RichText::from(label);

    if selected {
        label = label.color(egui::Color32::WHITE);
    }

    let mut button = egui::Button::new(label).min_size(egui::Vec2::new(60.0, 30.0));

    if selected {
        button = button.fill(egui::Color32::BLUE);
    }

    button
}
```

Then update the code that renders the buttons to use this function:

```rust
ui.horizontal(|ui| {
  let true_button = get_button(
    "true",
    self.quiz.current_question().user_answer == Some(true),
  );

  let false_button = get_button(
    "false",
    self.quiz.current_question().user_answer == Some(false),
  );

  if ui.add(true_button).clicked() {
    self.quiz.answer(true);
  }

  if ui.add(false_button).clicked() {
    self.quiz.answer(false);
  };
});
```

Now when you run the app and make a selection, the button will change color. Nice!

If you prefer your buttons are rounder, you can add the following code right after `ui.set_style()`:

```rust
ui.visuals_mut().widgets.inactive.rounding = egui::Rounding::from(6.0);
```

Voila! We're basically done. Let's see what's next for you.
