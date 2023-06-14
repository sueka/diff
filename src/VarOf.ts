type VarOf<F> =
  // F extends import('./Num').default ? never :
  F extends import('./Var').default<infer S extends string> ? S :
  F extends import('./Sum').default<any, any, infer V> ? V :
  F extends import('./Product').default<any, any, infer V> ? V :
  never
