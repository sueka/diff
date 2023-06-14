interface Diffible<P extends Expr, D extends Expr, G extends Expr> {
  diff(this: P): D
  grad<S extends string>(this: P, variable: import('./Var').default<S>): G | P
}
