import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";

export default tseslint.config(
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "sync-worker/**"],
  },
  ...tseslint.configs.recommended,
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "@next/next": nextPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // react-hooks v7 rules that are overly aggressive for valid React patterns
      // (setState in effect for localStorage init, ref.current assignment during render as escape hatch)
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      // French content uses ", ', «, » — escaping them is noise
      "react/no-unescaped-entities": "off",
      // _ prefix = intentionally unused (standard TypeScript convention)
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    },
    settings: {
      react: { version: "detect" },
    },
  }
);
