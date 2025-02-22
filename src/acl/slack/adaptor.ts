import { AbstractAdaptor } from "acl/common";
import { URL } from "domains/common";
import { Category } from "domains/article";
import { injectable } from "inversify";
import { MessageEvent } from "acl/slack/media-type";
import { Translator } from "./translator";

@injectable()
export class Adaptor extends AbstractAdaptor {
  public constructor(private readonly translator: Translator) {
    super();
  }

  public getURL(media: MessageEvent): URL {
    return this.translator.translateURL(media);
  }

  public getCategory(media: MessageEvent): Category {
    return this.translator.translateCategory(media);
  }
}
