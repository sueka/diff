interface Expr extends Hashable, IEq {
  _exprBrand: never // TODO: Delete
  simple(): Expr
  degree(): number
  degree(variable?: import('./Var').default): number
  vars(): import('immutable').Set<import('./Var').default>
}
