# gremix

> Do great stuff

A ~~Remix.run~~ React Router 💿 starter template for SSR. Includes the following setup:

- UnoCSS with Tailwind, Lucide Icons, Solar Icons, Spinner presets: https://icones.js.org/
- `clsx` dependency
- Prisma with helper scripts
- `<PendingUi />`
- Uses [biome](https://biomejs.dev) for linting and formatting
- Type-safe localstorage API. See [client-preferences](/app/lib/client-preference.ts) and [this post](https://degreat.co.uk/blog/typesafe-localstorage).
- `useColorScheme` hook to help you know when the app is in light or dark mode.
- Uses a [Hono](https://github.com/rphlmr/react-router-hono-server) server (instead of express)

## Environment variables

Here are the environment variables you need:

```sh
DATABASE_URL= # required if you'll use Prisma
COOKIE_SECRET= # optional
```
