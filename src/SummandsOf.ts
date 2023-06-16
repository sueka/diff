type SummandsOf<S extends Expr> =
  S extends import('./Sum').default<
    infer T extends Expr,
    infer U extends Expr
  >
  ? [...SummandsOf<T>, ...SummandsOf<U>]
  : [S]
