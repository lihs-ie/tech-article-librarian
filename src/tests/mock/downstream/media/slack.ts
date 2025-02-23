import { Media } from "./common";
import { type CallBackEventMedia } from "acl/slack";
import { Article } from "domains/article";
import { Builder, StringFactory } from "tests/factories/common";
import { URLFactory } from "tests/factories/domains/common";
import { z } from "zod";

const overridesSchema = z.object({
  model: z.instanceof(Article),
  channel: z.string(),
});

type Overrides =
  | Partial<CallBackEventMedia>
  | { model: Article; channel: string };

export class SlackCallbackMedia extends Media<
  Partial<CallBackEventMedia>,
  { model: Article; channel: string }
> {
  public createContent(): string {
    return JSON.stringify(this._data);
  }

  protected fillByModel(overrides: {
    model: Article;
    channel: string;
  }): CallBackEventMedia {
    return {
      token: Builder.get(StringFactory(10, 10)).build(),
      api_app_id: Builder.get(StringFactory(10, 10)).build(),
      type: "event_callback",
      event_id: Builder.get(StringFactory(10, 10)).build(),
      event_time: Date.now(),
      event: {
        type: "message",
        ts: Builder.get(StringFactory(10, 10)).build(),
        text: `<${overrides.model.url.value} | ${overrides.model.title}>\nTL;DR\n\n${overrides.model.description}"`,
        channel: overrides.channel,
        event_ts: Builder.get(StringFactory(10, 10)).build(),
        blocks: [
          {
            type: "rich_text",
            block_id: Builder.get(StringFactory(10, 10)).build(),
            elements: [
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "link",
                    url: overrides.model.url.value,
                    text: `\TL;DR\n\n${overrides.model.description}…`,
                  },
                ],
              },
            ],
          },
        ],
      },
    };
  }

  protected fill(overrides?: Overrides): CallBackEventMedia {
    if (overrides && overridesSchema.safeParse(overrides).success) {
      return this.fillByModel(overrides as { model: Article; channel: string });
    }

    const url = Builder.get(URLFactory).build();
    const title = Builder.get(StringFactory(1, 40)).build();
    const description = Builder.get(StringFactory(1, 40)).build();

    return {
      token: Builder.get(StringFactory(10, 10)).build(),
      team_id: Builder.get(StringFactory(10, 10)).build(),
      api_app_id: Builder.get(StringFactory(10, 10)).build(),
      type: "event_callback",
      event_id: Builder.get(StringFactory(10, 10)).build(),
      event_time: Date.now(),
      event: {
        type: "message",
        ts: Builder.get(StringFactory(10, 10)).build(),
        text: `<${url} | ${title}>\nTL;DR\n\n${description}"`,
        channel: Builder.get(StringFactory(10, 10)).build(),
        event_ts: Builder.get(StringFactory(10, 10)).build(),
        channel_type: Builder.get(StringFactory(10, 10)).build(),
        blocks: [
          {
            type: "rich_text",
            block_id: Builder.get(StringFactory(10, 10)).build(),
            elements: [
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "link",
                    url: url.value,
                    text: title,
                  },
                  {
                    type: "text",
                    text: `\TL;DR\n\n${description}…`,
                  },
                ],
              },
            ],
          },
        ],
      },
      ...overrides,
    };
  }
}
