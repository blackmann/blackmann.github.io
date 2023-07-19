---
title: 'Preact Signals: A journey through states'
description: Preact signals, as the simplest state management for React apps
pubDate: Jul 19 2023
---

## Redux, MobX

When I started React, the class component days, I had to learn Redux to deal with app-wide states. Even in those early days, I thought the concept of `action` -> `reducer` -> `state` was just too verbose. But the internet had different opinions. Like it allows you to build your state independent of your React app — one day you can just move it to another framework.

No one ever came back to tell that kind of story. Most of the time, from experience, how a lot of frontend solutions are sold are not realistic. Even if they are, it's true for a few use-cases.

> Knowledge of Redux even became a job requirement on a lot

But then, there was [MobX](https://mobx.js.org/README.html). MobX dealt away with the action [dispatch] and reducer boilerplate. Leaving us with just `state`. Now things became more straightforward — only requirement being to design your states carefully.

## Function Components, React Context

With the arrival of hooks as part of function components, came React Context. Now a native app-wide state management solution! But React Context is verbose and also doesn't sell well as a state management solution.

I think React Context sells more as "where am I (component) in the component tree". Which I think is is a brilliant design by the React team. This allows us to have many different components that can live in different contexts even on the same page/screen.

But the problem Contexts bring are:

1. How much is too much state? How many values can we make one Context keep without unnecessary triggering re-renders? How do we even define a pattern team-wide?

1. Effectively abstracting APIs using hooks. Since we can't have everybody directly accessing contexts and freestyling mutations and helpers, we have to expose the context with a hook and interact with the hook instead.

   ```javascript
   const PlaylistContext = React.createContext()

   function PlaylistProvider({ children }) {
     const [playlist, setPlaylist] = React.useState([])

     return (
      <PlaylistContext.Provider value={{playlist, setPlaylist}}>
        {children}
      </PlaylistProvider.Provider>
    )
   }

   function usePlaylist() {
    const {playlist, setPlaylist} = React.useContext(PlaylistContext)

    const loadPlaylist = React.useCallback(() => { }, [playlist, setPlaylist])
    const removeSong = React.useCallback((id) => { }, [loadPlaylist])

    // we don't expose `setPlaylist`, but allow users to use just these
    // APIs.
    return { loadPlaylist, removeSong, playlist }
   }

   export { PlaylistProvider, usePlaylist }
   ```

    This is a very simple example. For more complex scenarios, it's easy to have our callbacks depend on each other and cause unnecessary rerenders because `removeSong` changed (for example). Contexts can get very complicated!

1. Starship.jsx
    ```jsx
    <AuthProvider>
      <APIProvider key={apiKey}>
        <SuspenseWithFallback>
          <PlaylistProvider>
            <Routes />
          </PlaylistProvider>
        </SuspenseWithFallback>
      </APIProvider>
    </AuthProvider>
    ```

But I still prefer React Context to Redux or Mobx. 1) I like to stay native to developer technologies. 2) Lower bundle size. Every byte matters!

## Preact signals

Here is heaven!

wip...