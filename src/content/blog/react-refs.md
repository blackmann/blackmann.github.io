---
title: 'Understanding React refs and React.forwardRef'
description: 'What is the purpose of React.forwardRef'
pubDate: 'Jun 28 2023'
---

## Basics

Refs are used to get a handle on a child component. For example, getting a handle on a div component:

````jsx
function Component() {
  const divRef = useRef()

  // change div background to green
  //
  // note that this could have been written as
  // ```
  //  const div = document.querySelector('#content')
  //  div.style.background = 'green'
  // ```
  //
  // But it's best to use the React API
  React.useEffect(() => (divRef.current.style.background = 'green'), [])

  return (
    <main>
      <div id='content' ref={divRef}>Hello world</div>
    </main>
  )
}
````

This you might already know. But what if you need to pass it to your custom component? You can't simply accept a `ref` prop. If you tried to do the following, you'll notice that `ref` is `undefined`.

```tsx
import React from 'react'

interface Props {
  name: string
  ref: React.ForwardedRef<number>
}

function Demo({ name, ref }: Props) {
  console.log('ref value', ref) // logs "ref value `undefined`"

  return <div>Hello {name}, welcome to my world</div>
}

function Usage() {
  const demoRef = React.useRef(3)
  return <Demo name="Gr" ref={demoRef} />
}
```

This is because `ref`s are treated differently from other props. And this applies to just function components. It's for this reason `React.forwardRef` exists. Therefore, the `Demo` component is supposed to be written as:

```tsx
interface Props {
  name: string
}

const Demo = React.forwardRef(
  ({ name }: Props, ref: React.ForwardedRef<number>) => {
    setRef(ref, 8)
    return <div>Hello {name}, </div>
  }
)
```

In this example, I used `React.ForwardedRef<number>` to demonstrate that a ref can hold any Javascript value: DOM elements, numbers, objects, etc.

## A more practical / advanced usecase

Let's say we have a a video player that can seek to a certain time position.
On the page where we use this video component, we have a list of bookmarks. When you click on a bookmark, it _seeks_ the video to the time where the bookmark starts. How would you implement something like this?

You might be tempted to set up a whole context or global state management to deal with this. But this will mean the video component is supposed to be rewritten to be aware of your state changes. In my opinion, that will be a bad component design.

![Video player illustration](/video-player-ref-illustration.png)

Lets go ahead and implement the video component:

```tsx
interface Props {
  src: string
}

interface Player {
  seek: (seconds: number) => void
  pause: () => void
}

const VideoPlayer = React.forwardRef(
  ({ src }: Props, ref: React.ForwardedRef<Player>) => {
    const videoRef = React.useRef<HTMLVideoElement>(null)

    React.useEffect(() => {
      // see `setRef` implementation at the bottom of this post
      // Here, we're setting a custom object that has the API implementations
      // for our component.
      setRef(ref, {
        seek: (seconds) => {
          videoRef.current!.currentTime = seconds
        },
        pause: () => {
          videoRef.current!.pause()
        },
      })
    }, [])

    return <video ref={videoRef} src={src}></video>
  }
)
```

This is how we use it on the page:

```tsx
const bookmarks = []
function Page() {
  const playerRef = React.useRef<Player>(null)

  function moveToTime(time: number) {
    // Notice we're calling .seek here
    playerRef.current!.seek(time)
  }

  return (
    <main>
      <VideoPlayer ref={playerRef} />
      <ul>
        {bookmarks.map((chapter, i) => (
          <li key={i} onClick={() => moveToTime(chapter.time)}>
            {chapter.title} {formatTime(chapter.time)}
          </li>
        ))}
      </ul>
    </main>
  )
}
```

Voila, you have a child component that can be controlled by the parent. Please do well not to abuse this idea. In a lot of cases, using a combination of states and effects (`useEffect`) is just fine.

## Helper functions

Here's the implementation for `setRef`. Note that, ref props can be `undefined`, `RefObject` or a `function`.

```tsx
function setRef<T>(ref: React.ForwardedRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (typeof ref === 'object') {
    ref.current = value
  }
}
```

I hope this helps. If you have any question or suggestion, tweet [@\_yogr](https://twitter.com/_yogr)
