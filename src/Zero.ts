import Num from './Num'

export default class Zero extends Num {
  private constructor() {
    super(0)
  }

  static override of(value: 0) {
    return new Zero()
  }

  static get instance() {
    return new Zero()
  }
}
