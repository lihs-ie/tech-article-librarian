import { RawMedia } from "acl/article/line";
import { Article } from "domains/article";
import { List, Range } from "immutable";
import { Builder, StringFactory } from "tests/factories/common";
import { Media } from "../common";

export type Overrides = List<Article>;

export class LineMedia extends Media<Partial<RawMedia>, List<Article>> {
  createSuccessfulContent(): string {
    return JSON.stringify(this._data);
  }

  createFailureContent(): string {
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

  protected fillByModel(overrides: List<Article>): RawMedia {
    return {
      sentMessages: overrides
        .map((article) => ({
          id: article.identifier.value,
          quoteToken: Builder.get(StringFactory(1, 40)).build(),
        }))
        .toArray(),
    };
  }

  protected fill(overrides?: Partial<RawMedia> | List<Article>): RawMedia {
    if (List.isList(overrides)) {
      return this.fillByModel(overrides);
    }

    return {
      sentMessages: Range(0, 5)
        .map((index) => ({
          id: Builder.get(StringFactory(1, 40)).buildWith(index),
          quoteToken: Builder.get(StringFactory(1, 40)).buildWith(index),
        }))
        .toArray(),
      ...overrides,
    };
  }
}
