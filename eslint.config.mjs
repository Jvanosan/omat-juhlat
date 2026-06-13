import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // Next.js recommended rules (Core Web Vitals)
  ...nextVitals,

  // Next.js + TypeScript rules
  ...nextTs,

  // 🔧 Workaround for ESLint 9 + react/display-name bug
  {
    rules: {
      "react/display-name": "off",
    },
  },

  // Override default ignores of eslint-config-next
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
