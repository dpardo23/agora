// Formato del código de la web. Los documentos (docs/) y el diseño no se formatean con Prettier.
/** @type {import("prettier").Config} */
const config = {
  printWidth: 110,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/app/globals.css",
};

export default config;
