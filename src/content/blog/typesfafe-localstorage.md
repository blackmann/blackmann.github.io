---
title: Typesafe LocalStorage API
description: 'Safely relying on localstorage on a rapid-development project with Typescript'
pubDate: 'Aug 3, 2024'
---

Normally, we would access [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) like this:

```ts
const editorConfigPref = localStorage.getItem('editor-config')
const editorConfig = editorConfigPref ?
  JSON.parse(editorConfigPref) as EditorConfig
  : undefined
```

If you want to access this preference (ie, `editor-config`) from different places, you may have to write this similar (long) code at many places. If you're a proponent of [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), you'd create a function, maybe called `getEditorConfig`, to get the editor config. But what if you want to get `theme-preferences`, another function?

That aside for now! When we want to set something, we do:

```ts
localStorage.setItem('editor-config', editorConfig)
```

But here, how sure are we that we are passing a consistent `EditorConfig` structure when saving to localstorage. To protect yourself, you may strongly type the `editorConfig` variable so that when the `EditorConfig` structure changes, you get type errors on the variable instead of the call signature of `localStorage`. But you're not protected against a wrong key name.

So here's a better approach I came up with while working on a recent project:

```ts
// A specification of key names and expected types
type Pref = {
  "@project/editor-config": EditorConfig,
  "@project/theme-preferences": ThemePreferences,
  // ...more
};

type PrefKey = keyof Pref;

const pref = {
  /**
   * This will return a JSON parsed value as the type specified earlier based
   * on the `key`.
   **/
	get<T extends PrefKey>(key: T): Pref[T] | undefined {
		const value = localStorage.getItem(key);
		if (!value) return;

		return JSON.parse(value);
	},

  /**
   * Stringifies and saves value to localstorage
   **/
	set<T extends PrefKey>(key: T, value: Pref[T]) {
		localStorage.setItem(key as string, JSON.stringify(value));
	},
};

export { pref };
```

With `.get(key)`, you can't pass any other key apart from those listed in `Pref`. If you haven't guessed already, that means you get IntelliSense/autocomplete for key names.


`.set(key, value)` will strictly require only specified keys in `Pref` and corresponding type. You can't pass a value of different type even if its specified in `Pref` (under a different key).

Enjoy!
