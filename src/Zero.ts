import Num from './Num'

export default class Zero extends Num {
  #brand: any

  private constructor() {
    super(0)
  }

  static override of(value: 0) {
    return new Zero()
  }

  static get instance() {
    return new Zero()
  }

  static isZero(expr: Expr): expr is Zero {
    return #brand in expr // || expr instanceof Num && expr.equals(Zero.instance)
  }
}
