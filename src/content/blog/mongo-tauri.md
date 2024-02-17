---
title: 'Interfacing with MongoDB in Tauri 🦀 apps'
description: 'Using MongoDB in Tauri cross platform desktop apps'
pubDate: 'Jun 22 2023'
---

While working on a dashboard for a project, I considered using [Tauri](https://tauri.app) instead of Electron. Tauri apps have a way smaller bundle size than Electron (by about 30 times). And from my experience, Tauri has better developer experience compared to Electron.

I'll encourage you to try Tauri out when building your next cross-platform desktop app.

> This is not an introductory tutorial to neither MongoDB nor Tauri. Also, you're responsible for implementing security policies around your app/database access.

## The Problem

I needed to connect to a MongoDB instance and perform queries.

When working with Tauri, you don't have access to Node API like `fs`, `dns`, etc. so Javascript libraries like [mongodb](https://www.npmjs.com/package/mongodb) that make use of those APIs won't work — even though Tauri [UIs] are written with Javascript.

Tauri, however, provides some APIs[^1] to interact with the system. But when these provisions are not enough, you can also implement your own function in Rust and use [`tauri.invoke`](https://tauri.app/v1/api/js/tauri#invoke) to interface/interact with it. So for our problem, we'll have to do this: write our own function!

## Dependencies

First install the [`mongodb`](https://crates.io/crates/mongodb) crate.

Add the following to your `src-tauri/Cargo.toml`:

```toml
[dependencies.mongodb]
version = "2.5.0"
features = ["tokio-sync"]
```

## Backend

> Backend in Tauri language means the Rust part of the codebase.

The backend API we have to write shouldn't just solve one specific issue. That is, if our app can fetch users, products and orders, we shouldn't have three different backend functions that do each of those. We can have one single function and allow the fronted some freedom (to query whatever whenever).

That said, let's implement a general `find` API:

```rust
// main.rs

...

use futures::TryStreamExt;
use mongodb::{bson, bson::Document, options::FindOptions, Client};

#[tauri::command]
async fn db_find(
    client: tauri::State<'_, Client>,
    collection: String,
    filter: bson::Document,
) -> Result<Vec<Document>, ()> {
    let db = client.default_database().unwrap();
    let target_collection = db.collection::<Document>(&collection);
    let mut cursor = target_collection
        .find(filter, FindOptions::default())
        .await
        .unwrap();

    let mut results = Vec::new();
    while let Some(result) = cursor.try_next().await.unwrap() {
        results.push(result);
    }

    Ok(results)
}
```

Simple right? That's all for `find` and we'll be able to query MongoDB from the frontend in any manner that MongoDB allows.

## Frontend

A quick example to find all `user` accounts created today (from the frontend), will look like this:

```jsx
// users.jsx

import { invoke } from '@tauri-apps/api'

async function loadNewUsers() {
  const today = new Date()
  today.setHours(0, 0, 0) // beginning of day, not millisecond accurate

  // note that, you need to provide key/values for each [required] argument you specified for the
  // function at the backend. If you look at our Rust code, `collection: string` and `filter: object`
  // are required
  const args = {
    collection: 'users',
    filter: {
      // I chose this query to demonstrate that some data types like Dates and ObjectIDs need to be
      // passed in certain formats.
      created_at: { $gte: { $date: { $numberLong: `${today.valueOf()}` } } },
    },
  }
  return await invoke('db_find', args)
}

function NewUsers() {
  const [users, setUsers] = React.useState([])

  React.useEffect(() => {
    loadNewUsers().then((users) => setUsers(users))
  }, [])

  return (
    <>
      { users.map((user) => <div key={user._id.$oid}>{user.first_name}</div>) }
    <>
  )
}
```

That's how it is at the frontend. Simple and it's remarkably fast too. But that's not all, we need to register our Rust function on the app, else we'll have an exception thrown at us.

## Register

In `main()` function in `main.rs`, do the following to register our function:

```rust
// main.rs

// Update the previous `use` with this.
// Giving `use mongodb::{bson, bson::Document, options::ClientOptions, options::FindOptions, Client}`
use mongo::{options::ClientOptions, Client};

...

fn main() {
    let db_url = "mongodb://localhost:27017/demo";

    let options = ClientOptions::parse(db_url).expect("invalid database url");

    let client = Client::with_options(options).unwrap();

    tauri::Builder::default()
        // let's register `client` as a state. We'll be able to access it from the function
        // with tauri::State<Client>
        .manage(client)
        // register handler here
        .invoke_handler(tauri::generate_handler![db_find])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

```

Voila, we're done.

## ObjectIds and Dates

When passing queries involving [`ObjectId`](https://www.mongodb.com/docs/manual/reference/bson-types/#objectid) or Dates, you can't simply use string representations. From looking at how MongoDb encodes these values to JSON, I learned the following formats:

| Data type                         | Pass as                                                            |
|-----------------------------------|--------------------------------------------------------------------|
| ObjecId                           | `{ $oid: "<id value>" }`                                           |
| Date                              | `{ $date : { $numberLong: "<date in milliseconds>" }}`

[^1]: Here's a list of APIs Tauri exposes: https://tauri.app/v1/api/js/
