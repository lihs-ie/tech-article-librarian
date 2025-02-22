import { URL } from "domains/common";
import { OGP, OGPType } from "domains/ogp";
import { EnumFactory, Factory, Builder, StringFactory } from "../../common";
import { URLFactory } from "../common";

export const OGPTypeFactory = EnumFactory(OGPType);

export type OGPProperties = {
  identifier: URL;
  type: OGPType;
  title: string;
  image: URL | null;
  description: string | null;
};

export class OGPFactory extends Factory<OGP, OGPProperties> {
  protected instantiate(properties: OGPProperties): OGP {
    return new OGP(
      properties.identifier,
      properties.type,
      properties.title,
      properties.image,
      properties.description
    );
  }

  protected prepare(
    overrides: Partial<OGPProperties>,
    seed: number
  ): OGPProperties {
    return {
      identifier: Builder.get(URLFactory).buildWith(seed),
      type: Builder.get(OGPTypeFactory).buildWith(seed),
      title: Builder.get(StringFactory(1, 40)).buildWith(seed),
      image: Builder.get(URLFactory).buildWith(seed),
      description: Builder.get(StringFactory(1, 60)).buildWith(seed),
      ...overrides,
    };
  }

  protected retrieve(instance: OGP): OGPProperties {
    return {
      identifier: instance.identifier,
      type: instance.type,
      title: instance.title,
      image: instance.image,
      description: instance.description,
    };
  }
}
