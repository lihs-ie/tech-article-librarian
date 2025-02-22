import { URL } from "domains/common";
import { Factory } from "../../common";

export type URLProperties = {
  value: string;
};

export class URLFactory extends Factory<URL, URLProperties> {
  protected instantiate(properties: URLProperties): URL {
    return new URL(properties.value);
  }

  protected prepare(
    overrides: Partial<URLProperties>,
    seed: number
  ): URLProperties {
    return {
      value: `https://example.com/${seed}`,
      ...overrides,
    };
  }

  protected retrieve(instance: URL): URLProperties {
    return {
      value: instance.value,
    };
  }
}
