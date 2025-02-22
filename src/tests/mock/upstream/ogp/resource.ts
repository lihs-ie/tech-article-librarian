import { OGP } from "domains/ogp";
import { OGPFactory } from "tests/factories/domains/ogp";
import { OGPMedia } from "./media";
import { Resource, Type } from "../common";
import { Builder } from "tests/factories/common";

export type Overrides = { model: OGP; userAgent: string };

export class OGPResource extends Resource<Type, Overrides, {}> {
  public static CODE_PREFIX = "OGP";
  private readonly media: OGPMedia;

  constructor(type: Type, overrides?: Overrides) {
    super(
      type,
      overrides ?? {
        model: Builder.get(OGPFactory).build(),
        userAgent: "Mozilla/5.0",
      }
    );

    this.media = new OGPMedia(this.overrides.model);
  }

  public code(): string {
    const suffix = Object.entries(this.overrides.model)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    return `${OGPResource.CODE_PREFIX}/${suffix}/${this.overrides.userAgent}`;
  }

  public content(): string {
    return this.media.createSuccessfulContent();
  }

  public async matches(request: Request, uri: string): Promise<boolean> {
    if (request.method !== "GET") {
      return false;
    }

    if (request.url !== uri) {
      return false;
    }

    return true;
  }

  protected createSuccessfulResponse(_: Request): Response {
    return new Response(this.content());
  }
}
