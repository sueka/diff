type DerivOf<T> = T extends Diffible<any, infer U> ? U : never
