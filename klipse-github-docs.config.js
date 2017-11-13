() => [{
  user: 'polytypic',
  project: 'prettier-printer',
  scripts: [
    'https://unpkg.com/babel-polyfill/dist/polyfill.min.js',
    'infestines.js',
    'prettier-printer.js',
    'https://unpkg.com/ramda/dist/ramda.min.js'
  ],
  source: 'README.md',
  target: 'index.html',
  title: 'Prettier Printer',
  klipseHeader: false,
  stripComments: true,
  constToVar: true,
  menu: true,
  tooltips: true
}]
