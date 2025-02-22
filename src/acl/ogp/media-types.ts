import { OGPType } from "domains/ogp";
import * as cheerio from "cheerio";
import { Reader as BaseReader } from "acl/common";
import { injectable } from "inversify";

export type EntryMedia = {
  url: string;
  type: OGPType;
  title: string;
  image?: string;
  siteName?: string;
  description?: string;
};

@injectable()
export class Reader implements BaseReader<EntryMedia> {
  public read(content: string): EntryMedia {
    const media = cheerio.load(content);

    return this.ogp(media);
  }

  private ogp(media: cheerio.CheerioAPI): EntryMedia {
    return {
      url: this.readURL(media),
      type: this.readType(media),
      title: this.readTitle(media),
      image: this.readImage(media),
      description: this.readDescription(media),
    };
  }

  private readTitle(media: cheerio.CheerioAPI): string {
    return media('meta[property="og:title"]').attr("content") || media("title").text();
  }

  private readURL(media: cheerio.CheerioAPI): string {
    return (
      media('meta[property="og:url"]').attr("content") ||
      media('link[rel="canonical"]').attr("href") ||
      ""
    );
  }

  private readDescription(media: cheerio.CheerioAPI): string | undefined {
    return (
      (media('meta[property="og:description"]').attr("content") ||
        media('meta[name="description"]').attr("content")) ??
      undefined
    );
  }

  private readImage(media: cheerio.CheerioAPI): string | undefined {
    return (
      (media('meta[property="og:image"]').attr("content") ||
        media('meta[property="og:image:url"]').attr("content")) ??
      undefined
    );
  }

  private readType(media: cheerio.CheerioAPI): OGPType {
    return media('meta[property="og:type"]').attr("content") as OGPType;
  }
}
