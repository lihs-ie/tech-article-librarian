import { Map } from "immutable";
import { ValueObject } from "./value-object";

export class URL extends ValueObject {
  public constructor(public readonly value: string) {
    if (!value.match(/https?:\/\/.+/)) {
      throw new Error(`URL must be url string: ${value}.`);
    }
    super();
  }

  public values(): Map<string, unknown> {
    return Map({ value: this.value });
  }
}
