const Ajv = require('ajv');
const ejs = require('ejs');
const path = require('path');
const toml = require('toml');
const fs = require('fs-extra');

const BASE_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(BASE_DIR, 'dist');
const LANG_DIR = path.join(BASE_DIR, 'languages');
const TEMPLATE_DIR = path.join(__dirname, 'templates');

const validateSchema = new Ajv().compile(require('./schema.json'));

if (fs.existsSync(DIST_DIR)) {
  fs.emptyDirSync(DIST_DIR);
} else {
  fs.mkdirSync(DIST_DIR);
}

const languages = [];
const packages = new Set();
const setup = new Set();

function handleLanguage(file) {
  const language = toml.parse(fs.readFileSync(path.join(LANG_DIR, file)));
  languages.push(language);

  const valid = validateSchema(language);
  if (!valid) {
    console.error(`Error: ${name} schema invalid`);

    validateSchema.errors.forEach((error) =>
      console.error(`-> ${error.dataPath} ${error.message}`)
    );

    process.exit(1);
  }

  if (language.install) {
    for (const package of language.install.packages || []) {
      packages.add(package);
    }

    for (const cmd of language.install.setup || []) {
      setup.add(cmd);
    }
  }
}

fs.readdirSync(LANG_DIR)
  .filter((name) => name.endsWith('.toml'))
  .forEach(handleLanguage);

const ctx = {
  languages,
  packages,
  setup,
};

fs.readdirSync(TEMPLATE_DIR)
  .filter((name) => name.endsWith('.ejs'))
  .map((name) => [
    name,
    fs.readFileSync(path.join(TEMPLATE_DIR, name), 'utf-8'),
  ])
  .map(([name, template]) => [
    name.replace(/\.ejs$/, ''),
    ejs.render(template, ctx),
  ])
  .forEach(([name, output]) =>
    fs.writeFileSync(path.join(DIST_DIR, name), output)
  );
