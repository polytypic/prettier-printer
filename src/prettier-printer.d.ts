declare module 'prettier-printer' {
  type IDoc = string | IDocArray
  interface IDocArray extends Array<IDoc> {}

  // Rendering documents
  function render(maxCols: number, doc: IDoc): string
  function render(maxCols: number): (doc: IDoc) => string

  function renderWith<State>(
    actions: {
      text: (state: State, span: string) => State
      line: (state: State) => State
    },
    state: State,
    maxCols: number,
    doc: IDoc
  ): State

  // Document constants
  const line: IDoc
  const lineBreak: IDoc
  const softLine: IDoc
  const softBreak: IDoc

  // Concatenating documents
  function append(rhsDoc: IDoc, lhsDoc: IDoc): IDoc
  function append(rhsDoc: IDoc): (lhsDoc: IDoc) => IDoc

  function prepend(lhsDoc: IDoc, rhsDoc: IDoc): IDoc
  function prepend(lhsDoc: IDoc): (rhsDoc: IDoc) => IDoc

  // Lists of documents
  function intersperse(doc: IDoc, docs: IDoc[]): IDoc[]
  function intersperse(doc: IDoc): (docs: IDoc[]) => IDoc[]

  function punctuate(sepDoc: IDoc, docs: IDoc[]): IDoc[]
  function punctuate(sepDoc: IDoc): (docs: IDoc[]) => IDoc[]

  // Lazy documents
  function lazy(f: () => IDoc): IDoc

  // Enclosing documents
  function enclose(docPair: [IDoc, IDoc], doc: IDoc): IDoc
  function enclose(docPair: [IDoc, IDoc]): (doc: IDoc) => IDoc

  const angles: [IDoc, IDoc]
  const braces: [IDoc, IDoc]
  const brackets: [IDoc, IDoc]
  const dquotes: [IDoc, IDoc]
  const lineBreaks: [IDoc, IDoc]
  const lines: [IDoc, IDoc]
  const parens: [IDoc, IDoc]
  const spaces: [IDoc, IDoc]
  const squotes: [IDoc, IDoc]

  // Alternative documents
  function choice(wideDoc: IDoc, narrowDoc: IDoc): IDoc
  function choice(wideDoc: IDoc): (narrowDoc: IDoc) => IDoc

  function group(doc: IDoc): IDoc

  // Nested documents
  function nest(indent: string | number, doc: IDoc): IDoc
  function nest(indent: string | number): (doc: IDoc) => IDoc

  // Layout dependent documents
  function column(withColumn: (column: number) => IDoc): IDoc
  function nesting(withNesting: (nesting: number) => IDoc): IDoc

  // Aligned documents
  function align(doc: IDoc): IDoc

  function hang(indent: string | number, doc: IDoc): IDoc
  function hang(indent: string | number): (doc: IDoc) => IDoc

  function indent(indent: string | number, doc: IDoc): IDoc
  function indent(indent: string | number): (doc: IDoc) => IDoc
}
