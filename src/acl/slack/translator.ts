import { injectable } from "inversify";
import { MessageEvent } from "acl/slack/media-type";
import { List, Map } from "immutable";
import { URL } from "domains/common";
import { Category } from "domains/article";

@injectable()
export class Translator {
  public constructor(private readonly category: Map<string, Category>) {}

  public translateURL(media: MessageEvent): URL {
    const richTextURL = this.translateRichTextSection(media);

    if (richTextURL) {
      return richTextURL;
    }

    return this.translateText(media);
  }

  public translateCategory(media: MessageEvent): Category {
    const category = this.category.get(media.channel);

    if (!category) {
      throw new Error(
        `TranslateCategory failed by unexpected channel. ${media.channel}`
      );
    }

    return category;
  }

  private translateRichTextSection(media: MessageEvent): URL | null {
    const richTextSection = media.blocks?.map((block) => block.elements).flat();
    const messageBlock = media.message?.blocks
      .map((block) => block.elements)
      .flat();

    if (!richTextSection && !messageBlock) {
      return null;
    }

    let elements = richTextSection
      ?.map((section) =>
        section.elements.filter((element) => element.type === "link")
      )
      .flat();

    if (!elements) {
      elements = messageBlock
        ?.map((section) =>
          section.elements.filter((element) => element.type === "link")
        )
        .flat();
    }

    const urlElement = List(elements).first(null);

    if (!urlElement || !urlElement.url) {
      throw new Error(
        `URL element not found. \nrichTextSection: ${JSON.stringify(
          richTextSection
        )} \nmessageBlock: ${JSON.stringify(messageBlock)}`
      );
    }

    return new URL(urlElement.url);
  }

  private translateText(media: MessageEvent): URL {
    const text = media.text;

    if (!text) {
      throw new Error(`URL not found. ${JSON.stringify(media)}`);
    }

    const urlRegExp = new RegExp(/https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+/g);

    const matches = text.match(urlRegExp);

    if (matches === null) {
      throw new Error(`Unexpected text. ${text}`);
    }

    return new URL(matches[0]);
  }
}
