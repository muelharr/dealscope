import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "backend/dist/**",
      "backend/node_modules/**",
    ],
  },
  {
    files: ["backend/src/config/prisma.ts", "backend/src/config/redis.ts"],
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },
  eslintConfigPrettier,
];

export default eslintConfig;
