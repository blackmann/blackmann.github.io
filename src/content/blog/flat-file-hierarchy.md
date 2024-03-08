---
title: 'Flat file hierarchy'
description: 'Making a case against nested folders'
pubDate: 'Feb 24, 2024'
---

When people join my projects, they feel impulsive to suggest that I _organize_ my source files by grouping them in [sub-]folders. When I also join other people's projects, I feel they should ungroup them. In this post, I going to make a case for flat file hierarchies in an attempt to convince you.

> Though, you can attempt to convince me in the comments below.

## Intro

In 2021, when I was experimenting on ways to improve my developer workflow, I tried to go against the norm and try flat file hierarchies. That is, instead of nesting files **arbitrarily**, I'll just drop every file at the top of each major folder. The table illustration shows what a lot of us know and do; what I once used to do too:

### Nester

```bash
/src
├── components
│   ├── profile
│   │   ├── password-form.ts
│   │   └── profile-header.ts
│   └── posts
│       ├── post-item.ts
│       └── post-actions.ts
├── pages
│   ├── index.ts
│   ├── profile
│   │   ├── about.ts
│   │   └── settings.ts
│   │       ├── privacy-settings.ts
│   │       └── password.ts
│   └── posts
│       ├── index.ts
│       └── [id]
│           ├── index.ts
│           └── comments.ts
└── lib
    ├── api.ts
    └── image
        ├── crop.ts
        └── resize.ts
```

This diagram stops only two levels down, but they can go deeper than that; we know that. But I'm the _renegade_. And this is what I do:

### Flatter

```bash
/src
├── components
│   ├── password-form.ts
│   ├── profile-header.ts
│   ├── post-item.ts
│   └── post-actions.ts
├── pages
│   ├── index.ts
│   ├── profile.about.ts
│   ├── profile.settings.ts
│   ├── profile.settings.privacy-settings.ts
│   ├── profile.settings.password.ts
│   ├── posts.ts
│   ├── posts.[id].ts
│   └── posts.[id].comments.ts
└── lib
    ├── api.ts
    ├── image-crop.ts
    └── image-resize.ts
```

As you may have already noticed, it's just `components`, `pages` and `lib` at the top. No nesting within. That's my _style_.

## Pro-nesting

The argument I get for organizing using nesting is that, it makes it easier to find a source file. For example, if you wanted to edit the profile header, you go to `components`, then `profile`, then bham!, `profile-header.tsx` is there. Three clicks!

Or for pages, given a URL path, you can follow through the respective folders to find that file. So if you have a path like `/profile/settings/privacy-settings`, you click `pages > profile > settings > privacy-settings`.

Grouped beautifully.

## Pro-flattening

I can only make my case for flat hierarchies by making a case against nesting.

> You're free to make a case against flattening in the comments. Please be practical. I like to be practical.

1. Let's talk about when to add a new folder. Is there a rule? Or you have to use your best judgement? When you've made your judgement, how long does it take to settle on the name of the folder? I hope it's always instant! Because, for me, more than half of the time, it's hard to come up with a [good] name for a new folder/group. _Of course, except for pages/sub-pages._

1. A lot of people use domains as basis of nesting. For example, profile header, banner, etc. should be placed in the folder `/components/profile` -- the domain. The question is: does it make sense re-use the banner on a post detail page. If yes, do we still leave it in `/components/profile` or move it somewhere else? What will we call this new folder?

1. Collaboration. Is anyone free to create additional folders as they see fit? You can see how this will require some back and forth during reviews.

1. When do we stop nesting? 3 levels deep? 4?

1. Have you noticed that the files explorer of the IDE scrolls horizontally now? And the file you're looking for is weirdly at the edge? For me, this has been a DX problem for me when working between many files, because if I lost my way to a file, I scroll back horizontally, try to follow/find the folder level and then continue.

1. How many clicks to reach a file? `2+n`. In English, for any file you need more than two clicks to arrive. That is, if you're already in the `/src` folder.

1. Github browsing: when trying to read your code online, don't you find it hard going back and forth between folders looking for something?

Flattening is the absence of these troubles. My DX has improved significantly this way. I only know and need a few folders. You should try it some time.

## But you can…

But you can search for the file. <kbd>cmd</kbd><kbd>shft</kbd><kbd>o</kbd> on VSCode and type the file name. People make this point sometimes. But this is level ground for either option. All the other problems still exist for nesting.

Did I make my case? Let me know in the comments below.