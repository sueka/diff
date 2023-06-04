import Eq from './Eq'

export default abstract class HashableEq extends Eq implements Hashable {
  protected canEqual(that: Eq): that is HashableEq {
    return that instanceof HashableEq
  }

  /**
   * @implNote When you override this method, your implementation must return false if it is not `this.hashCode() === that.hashCode()`.
   */
  public equals(that: Eq): boolean {
    return this.canEqual(that) && that.canEqual(this) && this.hashCode() === that.hashCode()
  }

  public abstract hashCode(): number // int
}
