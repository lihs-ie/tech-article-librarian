import { AbstractAdaptor } from "acl/common";
import { injectable } from "inversify";
import { Reader } from "./media-types";
import { Translator } from "./translator";
import { URL } from "domains/common";
import { OGP } from "domains/ogp";

@injectable()
export class Adaptor extends AbstractAdaptor {
  public constructor(
    private readonly reader: Reader,
    private readonly translator: Translator,
    private readonly userAgent: string
  ) {
    super();
  }

  public async find(identifier: URL): Promise<OGP> {
    const response = await fetch(identifier.value, { headers: { "User-Agent": this.userAgent } });

    if (!response.ok) {
      throw new Error("OGP not found reason: " + response.statusText);
    }

    const content = await response.text();

    const media = this.reader.read(content);

    return this.translator.translate(media);
  }
}
