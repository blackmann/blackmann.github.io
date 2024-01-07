---
title: 'Preact Signals: A journey through states'
description: Why you should prefer Preact Signals as state management for your next React project.
pubDate: Jul 19 2023
---

## Redux, MobX, React Context

I have been to all those places. In order of more preferred, I'll have React Context first, followed by MobX then Redux.

React Context because it's close to the framework. MobX because it's less verbose and Redux last because for a single state, I don't want to be doing 3 things[^1].

[^1]: Just too much to know for handling states: https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers

## Preact Signals

Recently, like at the beginning of this year, I moved to [Preact Signals](https://preactjs.com/guide/v10/signals/) and I'm very happy and develop [around] states way faster. In simple words, Preact signals binds to the [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) node where it's rendered and updates that particular text node when a change happens[^2].

[^2]: https://github.com/preactjs/signals/tree/main/packages/react#rendering-optimizations

You can see how this is somewhat performant as the whole React component that uses the state does not have to re-render. But this is on an internal implementation level. Let's look at how I use Preact Signals.

Say, we have a component that renders a playlist:

```jsx
// components/Playlist.tsx

function Playlist() {
  return (
    <div>
      <header>Your playlist</header>
      <ul>
        {
          // we'll talk about `playlist` later
          playlist.map((song) => (
            <li>
              {song.title}

              <button>Favorite</button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
```

### Defining the state

I like to put the states in their own source files. It'll be more clearer by the end of this post.

```jsx
// playlits.ts

import { signal } from '@preact/signals'

const playlist = signal([])

export { playlist }
```

Preact signals can be used with React too. In that case you rather install and import from `@preact/signals-react`.

While we're here, let's add the functions to load the playlist and favorite a song.

```jsx
// data/playlist.ts

import { signal } from '@preact/signals'

const playlist = signal([])

async function loadPlaylist() {
  const json = await fetch('/playlist')
  playlist.value = JSON.parse(json) // this is how we update the state
}

async function favoriteSong(songId: string, favorite = true) {
  const newPlaylist = playlist.value.map((song) => {
    if (song.id === songId) {
      return {
        ...song,
        favorite,
      }
    }

    return song
  })

  playlist.value = newPlaylist
}

// now we export them
export { playlist, loadPlaylist, favoriteSong }
```

Just so you know, that's all you need to do for your state. Now let's use them in our component.

```jsx
// components/Playlist.tsx

import { playlist, loadPlaylist, favoriteSong } from '../data/playlist.ts'


function Playlist() {

  function handleOnFavorite(song: Song) {
    favoriteSong(song.id, !song.favorite)
  }

  React.useEffect(() => {
    loadPlaylist()
  }, [])

  return (
    ...
      <ul>
        {
          // Change this to playlist.value
          playlist.value.map((song) => (
            <li>
              {song.title}

              <button onClick={() => handleOnFavorite(song)}>
                {song.favorite ? 'Unfavorite': 'Favorite'}
              </button>
            </li>
          ))
        }
      </ul>
    ...
  )
}
```

Done.

Leave a comment below if you have any questions. You can leave a like if you think this was helpful. See you later, allig...
