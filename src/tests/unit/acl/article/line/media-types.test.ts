import { describe, expect, it } from "vitest";
import { v4 as uuid } from "uuid";
import { List, Map } from "immutable";
import { Article, Category } from "domains/article";
import { faker } from "@faker-js/faker";
import { Body, Writer } from "acl/article/line";
import { ArticleFactory } from "tests/factories/domains/article";
import { URL } from "domains/common";
import { Builder } from "tests/factories/common";
import { URLFactory } from "tests/factories/domains/common";

const createExpectedWritten = (
  user: string,
  noImageURL: URL,
  backGroundColors: Map<Category, string>,
  articles: List<Article>
): string =>
  JSON.stringify({
    to: user,
    messages: [
      {
        type: "template",
        altText: "Articles",
        template: {
          type: "carousel",
          columns: articles
            .map(
              (
                article
              ): Body["messages"][number]["template"]["columns"][number] => ({
                thumbnailImageUrl: article.image
                  ? article.image.value
                  : `${noImageURL.value}?text=${article.title}`,
                imageBackgroundColor: backGroundColors.get(
                  article.category,
                  "#FFFFFF"
                ),
                title: article.title,
                text: article.description ?? "",
                defaultAction: {
                  type: "uri",
                  label: "View",
                  uri: article.url.value,
                },
                actions: [
                  {
                    type: "postback",
                    label: "お気に入り",
                    data: JSON.stringify({
                      type: "favorite",
                      url: article.identifier.value,
                    }),
                  },
                ],
              })
            )
            .toArray(),
          imageAspectRatio: "rectangle",
          imageSize: "contain",
        },
      },
    ],
    notificationDisabled: true,
  } as Body);

describe("Package media-types", () => {
  describe("class writer", () => {
    describe("method write", () => {
      it("successful returns body.", () => {
        const user = uuid();
        const noImageURL = Builder.get(URLFactory).build();
        const backGroundColors: Map<Category, string> = List(
          Object.values(Category)
        ).reduce(
          (carry, current) =>
            carry.set(current, faker.color.rgb({ format: "hex", prefix: "#" })),
          Map<Category, string>()
        );

        const writer = new Writer(user, noImageURL.value, backGroundColors);

        const articles = Builder.get(ArticleFactory).buildList(5);

        const expected = createExpectedWritten(
          user,
          noImageURL,
          backGroundColors,
          articles
        );

        const actual = writer.write(articles);

        expect(actual).toBe(expected);
      });
    });
  });
});
