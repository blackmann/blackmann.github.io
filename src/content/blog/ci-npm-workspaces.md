---
title: 'CI: NPM Workspaces & GitHub Actions'
description: 'How to set up GitHub Actions to publish packages in a monorepo'
pubDate: 'Sep 17 2023'
---

While working on [mangobase](https://degreat.co.uk/mangobase), it took me trial and errors to set up Github Actions to automatically publish the packages. Mangobase consists of a number packages and I wanted to automatically version and publish them when a new commit is pushed or merged to the `master` branch.

<div class="scheme-img">
  <img src="/ci-try-errors-light.png">
  <img src="/ci-try-errors-dark.png" >
</div>

> Here's a link to the repo: https://github.com/blackmann/mangobase

## Versioning

One required step before publish is versioning. You can't publish the same version of a package twice to `npm`. So, we need to bump the version of the package before publishing. Manually, this would mean running a command like `yarn version --patch`. But for a monorepo containing many other packages, we need to run this command for each package with something like `yarn workspaces foreach version --patch`.

I didn't do that because before setting up CI, I was manually bumping the version of each package. So running that command will have the packages end up with different versions like `1.0.1`, `1.0.2`, `1.0.3`, etc. The problem with that is, `yarn version` creates a git tag for each version. So we could have a package with current version `1.0.1` get bumped to `1.0.2` but because yarn already created a git tag for `1.0.2` when bumping another package, it will fail to create a git tag for the current package. This will cause the CI to fail.

[Lerna](https://lerna.js.org) to the rescue. From my previous job, we made use of lerna. So I simply knew that was my solution. `lerna version` will bump the version of all packages in the monorepo to the same version and create a single git tag.

This entry goes into `deploy-npm.yml` as something like:

```yml
jobs:
  build:
    ...
    steps:
      ...
      - name: Bump version
        run: yarn lerna version --yes
```

## Publishing

Though I followed this guide: https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages, I wasn't conforming in some ways. I placed the `NODE_AUTH_TOKEN` at the wrong place, right below the build level `env`s. This caused the CI to fail with an error like:

```bash
lerna ERR! E429 429 Too Many Requests - PUT https://registry.npmjs.org/mangobase
```

This is how it should be:

```yml
jobs:
  build:
    ...
    steps:
      ...
      - name: Publish
        run: npx lerna publish from-package --yes --no-private
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

As you can see, I'm using lerna to publish all the packages.

## Committing

When lerna successfully tags the version bumps, it creates a commit with the changelog of each package. This is a very nice feature of lerna, to be honest. Now this commit needs to be pushed to Github. This means, git needs to be authenticated to work. Surprisingly, the way to make this work is very easy:

```yml
...

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # add this
    ...
```

## Triggers

One cool thing I learned from referencing the deploy file of [motion-canvas](https://github.com/motion-canvas/motion-canvas/blob/main/.github/workflows/publish.yml) is the ability to trigger workflows using a dropdown of choices.

<img src="/actions-ci-select.png" width="400" alt="Actions CI Select">

To configure that, you do:

```yml
on:
  workflow_dispatch:
    inputs:
      version:
        type: choice
        description: 'Version to publish'
        required: true
        default: patch
        options:
          - patch
          - minor
          - major
```

The value of the selected option is available in the workflow as `github.event.inputs.version`. I'm then able to pass that as the parameter to `lerna version`:

```yml
...
      - name: Bump version
        run: npx lerna version ${{ github.event.inputs.version }} --conventional-commits --yes --no-private
```

## Final working version

This what it looked at the end:

```yml
name: Publish packages to npm
on:
  workflow_dispatch:
    inputs:
      version:
        type: choice
        description: 'Version to publish'
        required: true
        default: patch
        options:
          - patch
          - minor
          - major

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v1
        with:
          node-version: 18
          registry-url: 'https://registry.npmjs.org'
      - run: git config --global user.email "<your email>"
      - run: git config --global user.name "<your name>"
      - name: Install dependencies
        run: yarn --frozen-lockfile
      - name: Turbo+Build
        run: yarn build
      - name: Test
        run: yarn test
      - name: Bump version
        run: npx lerna version ${{ github.event.inputs.version }} --conventional-commits --yes --no-private
      - name: Publish
        run: npx lerna publish from-package --yes --no-private
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

```