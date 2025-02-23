import { injectable } from "inversify";
import { Writer } from "./media-types";
import { List } from "immutable";
import { Article } from "domains/article";
import { ArticleAdaptor } from "../common";
import { v4 as uuid } from "uuid";

@injectable()
export class Adaptor extends ArticleAdaptor {
  public constructor(
    private readonly writer: Writer,
    private readonly endpoint: string,
    private readonly accessToken: string
  ) {
    super();
  }

  public async publish(articles: List<Article>): Promise<void> {
    const request = this.createRequest(articles);

    console.info(`Request upstream:\nto ${request[0]}\noptions ${JSON.stringify(request[1])}`);

    const response = await fetch(...request);

    if (!response.ok) {
      console.error(await response.text());
      this.handleErrorResponse(response);
    }
  }

  public async persist(_: Article): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async search(): Promise<List<Article>> {
    throw new Error("Method not implemented.");
  }

  private createRequest(articles: List<Article>): [RequestInfo, RequestInit] {
    return [`${this.endpoint}/bot/message/push`, this.createBody(articles)];
  }

  private createBody(articles: List<Article>): RequestInit {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
        "X-Line-Retry-Key": uuid(),
      },
      body: this.writer.write(articles),
    };
  }
}
