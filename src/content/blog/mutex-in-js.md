---
title: Mutex in Javascript (Typescript if you will)
description: Using singletons in multi-process/multi-promise use-cases
pubDate: August 13, 2025
---

## Motivation

Let's talk about the problem statement. We have to report some transactions to some analytics service. When authenticating with this service, we need to hit an endpoint with a `clientId` and `secret` to get an authentication `token` then use this _token_ to make the subsequent requests.

This `token` for making authenticated requests does expire and the time it takes to expire is stated in the response when retrieving the token. To make this vivid, here's what the code looks like:

```ts
const clientSecret = env.CLIENT_SECRET
const clientId = env.CLIENT_ID

async function getToken(): { token: string, expiresOn: number } {
  const res = await fetch(constants.ANALYTICS_AUTHENTICATION_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ clientId, clientSecret })
  })

  const data = await res.json()

  return data
}
```

Now when reporting these transactions, we can implement a function to report each transaction like this:


```ts
async function reportTransaction(transaction: T) {
  const token = await getToken()
  const res = await fetch(constants.ANALYTICS_REPORT, {
    method: "POST",
    body: JSON.stringify({ transaction })
  })

  return await res.json()
}

// report each transaction
for (const transaction of transactions) {
  await reportTransaction(transaction)
}
```

Before we continue, there's an issue. Our implementation of reporting one by one retrieved a new token every time. We don't want this. We should get the token once and if it's expired we request a new one. Let's do this:

```ts
const Authenticator = {
  token: null as string | null,
  expires: null as  Date | null,
  async getToken() {
    if (!token || this.expired) {
      console.log('[Authenticator] retrieving new token…')
      const res = await fetch(constants.ANALYTICS_AUTHENTICATION_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ clientId, clientSecret })
      })

      const data = await res.json()
      this.token = data.token
      this.expires = new Date(data.expiresOn)
    }

    return this.token
  },
  get expired() {
    // npm install dayjs
    return this.expires === null || dayjs().isAfter(expires)
  }
}
```

Then we update our reporting code like:

```ts
async function reportTransaction(transaction: T) {
  const token = await getToken() // [!code --]
  const token = await Authenticator.getToken() // [!code ++]
  // ...
}
```

This will only get a new token when necessary.

But if we have thousands of transactions, we wouldn't want to do this one by one. It'll be slow. We can parallelize them. We could use [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [queues](https://docs.bullmq.io/guide/queues) or [parallel](https://radashi.js.org/reference/async/parallel/).

For simplicity, let's try to use `Promises` but with a slice of the transactions:

```ts
const sliced = transactions.slice(10)
await Promise.all(sliced.map((transaction) => reportTransaction(transaction)))
```

If you attempt to do this, you'll notice that the console will log

```bash
[Authenticator] retrieving new token… (10)
```

_The (10) at the end signifiying it has been logged 10 times_.

The reason this is happening is because the `Authenticator.get` was triggered the same time 10 times. Because it takes time to resolve, by the time each _promise_ tries to access `.token`, it would be `null` so it attempts to request for the token. This same concept applies to using the other methods: queues, parallel, etc.

This is not what we want. We only want to request for tokens once until they're expired.

## Mutex

One blessing learning the [Go](https://go.dev) gave me was the idea of [Mutex](https://en.wikipedia.org/wiki/Mutual_exclusion). Is simpler words, mutex will allow access to a resource one at a time. So let's use a mutex:

```sh
npm i async-mutex
```

The we rewrite our `Authenticator` like this:

```ts
import { Mutex } from 'async-mutex' // [!code ++]

const mutex = new Mutex() // [!code ++]

const Authenticator = {
  // ...
  async getToken() {
    await mutex.runExclusive(async () => { // [!code ++]
      if (!token || this.expired) {
        console.log('[Authenticator] retrieving new token…')
        const res = await fetch(constants.ANALYTICS_AUTHENTICATION_ENDPOINT, {
          method: "POST",
          body: JSON.stringify({ clientId, clientSecret })
        })

        const data = await res.json()
        this.token = data.token
        this.expires = new Date(data.expiresOn)
      }
    }) // [!code ++]

    return this.token
  },
  // ...
}
```

This saves the day. Tokens will only be requested when they expire and only just once.

I hope this saves your day one day.
