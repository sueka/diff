interface Diffible {
  diff<P extends Expr>(this: P): Expr<VarOf<P>>
  grad<P extends Expr, S extends string>(this: P, variable: import('./Var').default<S>): Expr<VarOf<P>>
}
