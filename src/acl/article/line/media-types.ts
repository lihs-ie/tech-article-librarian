import { injectable } from "inversify";
import { Writer as BaseWriter, Reader as BaseReader } from "acl/common";
import { List, Map } from "immutable";
import { Article, Category } from "domains/article";

export type RawMedia = {
  sentMessages: Array<{ id: string; quoteToken: string }>;
};

export class Reader implements BaseReader<RawMedia> {
  public read(content: string): RawMedia {
    return JSON.parse(content);
  }
}

type Action = {
  type: "uri" | "postback";
  label: string;
  uri?: string;
  data?: string;
};

type DefaultAction = {
  type: "uri";
  label: string;
  uri: string;
};

type Column = {
  thumbnailImageUrl: string;
  imageBackgroundColor: string;
  title: string;
  text: string;
  defaultAction: DefaultAction;
  actions: Action[];
};

type Template = {
  type: "carousel";
  columns: Column[];
  imageAspectRatio: "rectangle";
  imageSize: "contain";
};

type TemplateMessage = {
  type: "template";
  altText: string;
  template: Template;
};

export type Body = {
  to: string;
  messages: TemplateMessage[];
  notificationDisabled?: boolean;
};

@injectable()
export class Writer implements BaseWriter<List<Article>> {
  constructor(
    private readonly user: string,
    private readonly noImageURL: string,
    private readonly backGroundColors: Map<Category, string>
  ) {}

  public write(articles: List<Article>): string {
    const columns = articles
      .map((article) => this.writeColumn(article))
      .toArray();

    const template: Template = {
      type: "carousel",
      columns,
      imageAspectRatio: "rectangle",
      imageSize: "contain",
    };

    const message: TemplateMessage = {
      type: "template",
      altText: "Articles",
      template,
    };

    return JSON.stringify({
      to: this.user,
      messages: [message],
    } as Body);
  }

  private writeColumn(article: Article): Column {
    return {
      thumbnailImageUrl: article.image
        ? article.image.value
        : encodeURIComponent(`${this.noImageURL}?text=${article.title}`),
      imageBackgroundColor: this.backGroundColors.get(
        article.category,
        "#FFFFFF"
      ),
      title: article.title,
      text: article.description ?? `${article.category}の記事`,
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
    };
  }
}
