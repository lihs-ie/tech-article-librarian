import { OGP } from "domains/ogp";
import { injectable } from "inversify";
import { EntryMedia } from "./media-types";
import { URL } from "domains/common";

@injectable()
export class Translator {
  public translate(media: EntryMedia): OGP {
    return new OGP(
      new URL(media.url),
      media.type,
      media.title,
      media.image ? new URL(media.image) : null,
      media.description ?? null
    );
  }
}
