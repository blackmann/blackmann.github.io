import { reactRouter } from "@react-router/dev/vite";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite-plus";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [
    reactRouterHonoServer({ dev: { exclude: [/\/__uno.css/] } }),
    reactRouter(),
    UnoCSS(),
    tsconfigPaths(),
  ],
});
