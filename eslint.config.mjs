import {dirname} from "path";
import {fileURLToPath} from "url";
import {FlatCompat} from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    {
        ignores: ["src/types/supabase.ts"]
    },
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        // here we override/disable individual rules:
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
];

export default eslintConfig;
