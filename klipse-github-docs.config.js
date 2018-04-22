;() => [
  {
    user: 'polytypic',
    project: 'prettier-printer',
    scripts: [
      'https://unpkg.com/babel-polyfill/dist/polyfill.min.js',
      'https://unpkg.com/infestines/dist/infestines.js',
      'https://unpkg.com/partial.lenses/dist/partial.lenses.js',
      'https://unpkg.com/partial.lenses.validation/dist/partial.lenses.validation.js',
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
  }
]
