type HashableEq = import('./HashableEq').default

interface Expr extends HashableEq {
  _exprBrand: never // TODO: Delete
  simple(): Expr
  degree(): number
  degree(variable?: import('./Var').default): number
  vars(): import('immutable').Set<import('./Var').default>
}
