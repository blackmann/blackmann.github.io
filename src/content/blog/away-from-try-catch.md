---
title: 'Moving away from try-catch'
description: 'Improving code readability and maintainability by avoiding try-catch'
pubDate: 'Jun 09 2025'
tags:
  - typescript
---

How often you use a `try-catch` block in your code depends on how you reason about your code. For me, I hate to return optional values. So when I don't have values, I throw an error. For example,

```typescript
async function getUser(id: string) {
  const user = await db.getUser(id)
  if (!user) {
    throw new Error('User not found')
  }
  return user
}
```

This way, I am always sure that `getUser`'s inferred return type is `User` but not `User | undefined`.

```typescript
// ✅ Because of throw [Specimen A]
{
  const user = await getUser('123')
  sendEmail(user.email, 'Welcome to the platform')
}

// ❌ Because of optional [Specimen B]
{
  const user = await getUser('123')
  if (!user) {
    console.log('User not found')
    return
  }
  sendEmail(user.email, 'Welcome to the platform')
  // We cannot do sendEmail(user?.email) because `sendEmail`
  // expects a string for email so TypeScript will show an error
}
```

But what happens if `Specimen A` actually throws an error? Traditionally, we would use a `try-catch` block to handle the error.

```typescript
try {
  const user = await getUser('123')
  sendEmail(user.email, 'Welcome to the platform')
} catch (error) {
  console.error('User not found')
}
```

Some of you may be familiar with something like this. But I've grown not to like it. Because for longer codeblocks, you'll find the majority of your logic sitting inside the `try` block, which is weird to me.

Additionally, it's hard to follow which line of code is responsible for an error when looking at the `catch` block.

So recently, I've been using the [try-it](https://radashi.js.org/reference/async/tryit/) module from [Radashi](https://radashi.js.org/) to handle errors. It uses a similar idea to how errors are handled in Go.

```typescript
import { tryit } from 'radashi'

{
  const [user, error] = await tryit(getUser)('123')
  if (error) {
    console.error('User not found')
    return
  }

  // Notice that we don't have to check if `user` is defined
  sendEmail(user.email, 'Welcome to the platform')
}
```

Sane.
