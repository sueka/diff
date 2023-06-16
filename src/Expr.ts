interface Expr extends Hashable {
  _exprBrand: never // TODO: Delete
  degree(): number
  degree(variable?: import('./Var').default): number
  vars(): Set<string>
}
