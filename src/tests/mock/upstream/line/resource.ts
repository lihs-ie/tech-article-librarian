import { Body } from "acl/article/line";
import { Article, Category } from "domains/article";
import { List, Map } from "immutable";
import { ArticleFactory } from "tests/factories/domains/article";
import { Builder, StringFactory } from "tests/factories/common";
import { LineMedia } from "./media";
import { v4 as uuid } from "uuid";
import { URL } from "domains/common";
import { Resource, Type } from "../common";
import { URLFactory } from "tests/factories/domains/common";

export type Overrides = {
  model: List<Article>;
  user: string;
  accessToken: string;
  retryKey: string;
  noImageURL: URL;
  backGroundColors: Map<Category, string>;
};

export class LineResource extends Resource<Type, Overrides, {}> {
  public static CODE_PREFIX = "LINE";
  private readonly media: LineMedia;

  constructor(type: Type, overrides?: Overrides) {
    super(
      type,
      overrides ?? {
        model: Builder.get(ArticleFactory).buildList(3),
        user: Builder.get(StringFactory(1, 40)).build(),
        accessToken: Builder.get(StringFactory(64, 64)).build(),
        retryKey: uuid(),
        noImageURL: Builder.get(URLFactory).build(),
        backGroundColors: Map<Category, string>(),
      }
    );

    this.media = new LineMedia(this.overrides.model);
  }

  public code(): string {
    return LineResource.CODE_PREFIX;
  }

  public content(): string {
    return this.media.createSuccessfulContent();
  }

  public async matches(request: Request, uri: string): Promise<boolean> {
    console.log(request.method, "hogehoge");
    if (request.method !== "POST") {
      return false;
    }

    if (!uri.startsWith(`/bot/message/push`)) {
      return false;
    }

    return true;
  }

  protected createSuccessfulResponse(_: Request): Response {
    return new Response(this.content());
  }

  private async matchBody(request: Request): Promise<boolean> {
    const body = JSON.parse(await request.text()) as Body;

    if (body.to !== this.overrides.user) {
      return false;
    }

    const comparand = body.messages[0];

    const expected = this.overrides.model.map(
      (article): Body["messages"][number]["template"]["columns"][number] => ({
        thumbnailImageUrl:
          article.image?.value ?? this.overrides.noImageURL.value,
        imageBackgroundColor: this.overrides.backGroundColors.get(
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
    );

    const valid = expected
      .zip(List(comparand.template.columns))
      .some(([expected, actual]) => {
        if (expected.thumbnailImageUrl !== actual.thumbnailImageUrl) {
          return false;
        }

        if (expected.imageBackgroundColor !== actual.imageBackgroundColor) {
          return false;
        }

        if (expected.title !== actual.title) {
          return false;
        }

        if (expected.text !== actual.text) {
          return false;
        }

        return true;
      });

    if (!valid) {
      return false;
    }

    return true;
  }
}
