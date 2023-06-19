interface Expr<
  V extends string = string // can be extracted by VarOf
> extends Hashable, IEq {
  _exprBrand: never // TODO: Delete
  simple(): Expr // TODO: Make it some narrower if needed
  degree(): number
  degree(variable?: import('./Var').default): number
  vars(): import('immutable').Set<import('./Var').default<V>>
}
