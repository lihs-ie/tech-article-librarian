import { OGP } from "domains/ogp";
import { OGPTypeFactory } from "tests/factories/domains/ogp";
import { Builder, StringFactory } from "tests/factories/common";
import { URLFactory } from "tests/factories/domains/common";

export type Overrides = string | OGP;

export class OGPMedia {
  private readonly _data: string;

  public constructor(overrides?: Overrides) {
    this._data = this.fill(overrides);
  }

  public createSuccessfulContent(): string {
    return this._data;
  }

  public createFailureContent(): string {
    return JSON.stringify({
      errors: [
        {
          reason: 101,
          cause: "unit",
          value: "sku099",
        },
      ],
    });
  }

  protected fillByModel(overrides: OGP): string {
    return `<html lang="ja">
      <head>
        <meta content="${overrides.identifier.value}" property="og:url">
        <meta property="og:type" content="${overrides.type}" />
        <meta property="og:title" content="${overrides.title}" />
        ${
          overrides.image
            ? `<meta property="og:image" content="${overrides.image.value}" />`
            : ""
        }
        <meta
          property="og:description"
          content="${overrides.description}"
        />
      </head>

      <body></body>
      </html>`;
  }

  protected fill(overrides?: Overrides): string {
    if (overrides instanceof OGP) {
      return this.fillByModel(overrides);
    }

    const url = Builder.get(URLFactory).build();
    const type = Builder.get(OGPTypeFactory).build();
    const title = Builder.get(StringFactory(1, 40)).build();
    const image = Builder.get(URLFactory).build();
    const description = Builder.get(StringFactory(1, 60)).build();

    return overrides
      ? overrides
      : `<html lang="ja">
      <head>
        <meta content="${url.value}" property="og:url">
        <meta property="og:type" content="${type}" />
        <meta property="og:title" content="${title}" />
        <meta
          property="og:image"
          content="${image?.value}"
        />
        <meta
          property="og:description"
          content="${description}"
        />
      </head>

      <body></body>
      </html>`;
  }
}
