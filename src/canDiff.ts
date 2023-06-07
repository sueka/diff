// TODO: Make a brand check if needed
export default function canDiff<T extends Expr>(expr: T): expr is T & Diffible<T, DerivOf<T>> {
  return 'diff' in expr && typeof expr.diff === 'function'
}
