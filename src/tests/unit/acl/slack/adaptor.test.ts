import { Adaptor, Translator } from "acl/slack";
import { Category } from "domains/article";
import { Map } from "immutable";
import { Builder, StringFactory } from "tests/factories/common";
import {
  ArticleFactory,
  CategoryFactory,
} from "tests/factories/domains/article";
import { SlackCallbackMedia } from "tests/mock/downstream/media/slack";
import { describe, expect, it } from "vitest";

const createAdaptor = (
  category: Map<string, Category> = Map<string, Category>({
    [Builder.get(StringFactory(10, 10)).build()]:
      Builder.get(CategoryFactory).build(),
  })
) => new Adaptor(new Translator(category));

describe("Package adaptor", () => {
  describe("class Adaptor", () => {
    describe("getURL", () => {
      describe("successfully", () => {
        it("should return URL", () => {
          const article = Builder.get(ArticleFactory).build();
          const channel = Builder.get(StringFactory(10, 10)).build();

          const category = Map<string, Category>({
            [channel]: article.category,
          });

          const media = new SlackCallbackMedia({ model: article, channel });

          const adaptor = createAdaptor(category);

          const actual = adaptor.getURL(media.data().event);

          expect(article.url.equals(actual)).toBeTruthy;
        });
      });
    });

    describe("getCategory", () => {
      describe("successfully", () => {
        it("should return Category", () => {
          const article = Builder.get(ArticleFactory).build();
          const channel = Builder.get(StringFactory(10, 10)).build();

          const category = Map<string, Category>({
            [channel]: article.category,
          });

          const media = new SlackCallbackMedia({ model: article, channel });

          const adaptor = createAdaptor(category);

          const actual = adaptor.getCategory(media.data().event);

          expect(actual).toBe(article.category);
        });
      });
    });
  });
});
