type DerivOf<E, V extends string = string> =
  E extends Diffible<infer T, infer U> ?
  VarOf<T> extends V ? U : T :
  never
