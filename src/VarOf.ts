type VarOf<T> =
  // T extends import('./Num').default ? never :
  T extends import('./Var').default<infer S extends string> ? S :
  T extends import('./Sum').default<any, any, infer V> ? V :
  T extends import('./Product').default<any, any, infer V> ? V :
  never
