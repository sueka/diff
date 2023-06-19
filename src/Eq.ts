/**
 * @implNote When you override [[equals]], you must also override [[canEqual]].
 */
export default abstract class Eq implements IEq {
  /**
   * Returns whether `this` and `that` can be equal.
   *
   * @implNote When you override this method in a subclass, your implementation must return whether `that` is an instance of that class.
   */
  protected abstract canEqual(that: Eq): boolean

  /**
   * Returns whether `this` and `that` are equal.
   *
   * @implNote When you override this method, your implementation must return false if it is not `this.canEqual(that) && that.canEqual(this)`.
   */
  public abstract equals(that: Eq): boolean

  /**
   * @final
   */
  public isNotEqualTo(that: Eq): boolean {
    return !this.equals(that)
  }
}
