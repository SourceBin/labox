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

const languageConfigs = fs
  .readdirSync(LANG_DIR)
  .filter((name) => name.endsWith('.toml'))
  .map((name) => [name, fs.readFileSync(path.join(LANG_DIR, name))])
  .map(([name, file]) => [name.replace(/\.toml$/, ''), toml.parse(file)])
  .reduce((map, [name, cfg]) => map.set(name, cfg), new Map());

const handledLanguages = [];
const packages = [];
const setup = [];

function handleLanguage(name, cfg) {
  if (handledLanguages.includes(cfg)) {
    return;
  }
  handledLanguages.push(cfg);

  const valid = validateSchema(cfg);
  if (!valid) {
    console.error(`Error: ${name} schema invalid`);

    validateSchema.errors.forEach((error) =>
      console.error(`-> ${error.dataPath} ${error.message}`)
    );

    process.exit(1);
  }

  if (cfg.install) {
    for (const dep of cfg.install.depends || []) {
      handleLanguage(dep, languageConfigs.get(dep));
    }

    for (const pkg of cfg.install.packages || []) {
      if (!packages.includes(pkg)) {
        packages.push(pkg);
      }
    }

    for (const cmd of cfg.install.setup || []) {
      if (!setup.includes(cmd)) {
        setup.push(cmd);
      }
    }
  }
}

[...languageConfigs.entries()]
  .filter(([name]) => !process.argv[2] || name === process.argv[2])
  .forEach(([name, cfg]) => handleLanguage(name, cfg));

const ctx = {
  languages: handledLanguages,
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
