import { defineConfig} from "vitest/config";
export default defineConfig({
  test:{
    environment: 'jsdom',
    server:{
      deps: {
        inline: ['vitest-canvas-mock'],
      },
    },
    coverage: {
      exclude: [
        '**',
        '!src/**/*.*'
      ]
    }
  }
});