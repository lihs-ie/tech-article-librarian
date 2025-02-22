import { Map } from "immutable";

export abstract class ValueObject {
  protected abstract values(): Map<string, unknown>;

  public equals(comparison: this): boolean {
    return this.hashCode() === comparison.hashCode();
  }

  public hashCode() {
    return this.values().set("constructor", this.constructor).hashCode();
  }
}
