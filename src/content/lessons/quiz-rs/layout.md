---
title: Layouting
pubDate: 10 Jan 2024
index: 35
---

We can all agree, our app is not looking good. If you don't care about looks, I think we're done here. Else, let's ge'it.

If you remember, from our [design](design), we need to restrict the width and height of our app. Let's update our [`NativeOptions`](https://docs.rs/eframe/latest/eframe/struct.NativeOptions.html) in `main`:

```rust
fn main() -> Result<(), eframe::Error> {
    let viewport = ViewportBuilder::default().with_inner_size(egui::Vec2::new(300.0, 400.0));

    let options = eframe::NativeOptions{
      viewport,
      // This is a common patter in Rust. See below
      ..Default::default(),
    };

    eframe::run_native("Queeez", options, Box::new(|ctx| Box::new(App::new(ctx))))
}
```