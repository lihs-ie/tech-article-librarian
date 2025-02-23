import { callbackEventSchema } from "acl/slack";
import { describe } from "node:test";
import { Builder, StringFactory } from "tests/factories/common";
import { ArticleFactory } from "tests/factories/domains/article";
import { SlackCallbackMedia } from "tests/mock/downstream/media/slack";
import { expect, it } from "vitest";

const sample = {
  token: "xU63tiDKYQteuOO3wIJRXT1f",
  team_id: "T06QL3FF0P2",
  context_team_id: "T06QL3FF0P2",
  context_enterprise_id: null,
  api_app_id: "A06PQP5TT62",
  event: {
    type: "message",
    subtype: "message_changed",
    message: {
      user: "U06PUC1E3AR",
      type: "message",
      client_msg_id: "38735b4b-e61f-4e37-bfbd-a8fd2eb0bfca",
      text: "<https://zenn.dev/cybozu_frontend/articles/frontend_weekly_20250218|TypeScript 5.8 RCの公開など(2025-02-18号)>",
      team: "T06QL3FF0P2",
      attachments: [
        {
          from_url:
            "https://zenn.dev/cybozu_frontend/articles/frontend_weekly_20250218",
          image_url:
            "https://res.cloudinary.com/zenn/image/upload/s--MdaQwfHK--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:TypeScript%25205.8%2520RC%25E3%2581%25AE%25E5%2585%25AC%25E9%2596%258B%25E3%2581%25AA%25E3%2581%25A9%25282025-02-18%25E5%258F%25B7%2529%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:daiki%2520%252F%2520%25E3%2581%258D%25E3%2581%25A1%25E3%2581%258F%25E3%2582%258A%25E3%2581%2599%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL3plbm4tdXNlci11cGxvYWQvYXZhdGFyL2VjOTA1OThlNjEuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:%25E3%2582%25B5%25E3%2582%25A4%25E3%2583%259C%25E3%2582%25A6%25E3%2582%25BA%2520%25E3%2583%2595%25E3%2583%25AD%25E3%2583%25B3%25E3%2583%2588%25E3%2582%25A8%25E3%2583%25B3%25E3%2583%2589%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL3plbm4tdXNlci11cGxvYWQvYXZhdGFyLzkzN2NiNjM1NWYuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png",
          image_width: 1200,
          image_height: 630,
          image_bytes: 35110,
          service_icon: "https://zenn.dev/favicon.ico",
          id: 1,
          original_url:
            "https://zenn.dev/cybozu_frontend/articles/frontend_weekly_20250218",
          fallback: "Zenn: TypeScript 5.8 RCの公開など(2025-02-18号)",
          title: "TypeScript 5.8 RCの公開など(2025-02-18号)",
          title_link:
            "https://zenn.dev/cybozu_frontend/articles/frontend_weekly_20250218",
          service_name: "Zenn",
        },
      ],
      blocks: [
        {
          type: "rich_text",
          block_id: "vktMG",
          elements: [
            {
              type: "rich_text_section",
              elements: [
                {
                  type: "link",
                  url: "https://zenn.dev/cybozu_frontend/articles/frontend_weekly_20250218",
                  text: "TypeScript 5.8 RCの公開など(2025-02-18号)",
                },
              ],
            },
          ],
        },
      ],
      ts: "1740093665.154919",
    },
    previous_message: {
      user: "U06PUC1E3AR",
      type: "message",
      ts: "1740093665.154919",
      client_msg_id: "38735b4b-e61f-4e37-bfbd-a8fd2eb0bfca",
      text: "<https://zenn.dev/cybozu_frontend/articles/frontend_weekly_20250218|TypeScript 5.8 RCの公開など(2025-02-18号)>",
      team: "T06QL3FF0P2",
      blocks: [
        {
          type: "rich_text",
          block_id: "vktMG",
          elements: [
            {
              type: "rich_text_section",
              elements: [
                {
                  type: "link",
                  url: "https://zenn.dev/cybozu_frontend/articles/frontend_weekly_20250218",
                  text: "TypeScript 5.8 RCの公開など(2025-02-18号)",
                },
              ],
            },
          ],
        },
      ],
    },
    channel: "C06PQLHMNJJ",
    hidden: true,
    ts: "1740093670.000300",
    event_ts: "1740093670.000300",
    channel_type: "channel",
  },
  type: "event_callback",
  event_id: "Ev08EBG6RX6W",
  event_time: 1740093670,
  authorizations: [
    {
      enterprise_id: null,
      team_id: "T06QL3FF0P2",
      user_id: "U06PXCP1YH0",
      is_bot: true,
      is_enterprise_install: false,
    },
  ],
  is_ext_shared_channel: false,
  event_context:
    "4-eyJldCI6Im1lc3NhZ2UiLCJ0aWQiOiJUMDZRTDNGRjBQMiIsImFpZCI6IkEwNlBRUDVUVDYyIiwiY2lkIjoiQzA2UFFMSE1OSkoifQ",
};

const sample2 = {
  token: "xU63tiDKYQteuOO3wIJRXT1f",
  team_id: "T06QL3FF0P2",
  context_team_id: "T06QL3FF0P2",
  context_enterprise_id: null,
  api_app_id: "A06PQP5TT62",
  event: {
    subtype: "bot_message",
    text: "<https://blog.generative-agents.co.jp/entry/with-devin|Devinを導入して1ヶ月経ったので、人間とAIとでどのような開発の役割分担をするべきか振り返ってみる | Generative Agents Tech Blog>\nこんにちは、ジェネラティブエージェンツの西見です。 「完全自律型AIエンジニア」という触れ込みと、その印象的なティザー動画で一躍有名になったDevinが、2024年12月10日にGAしました。 <http://www.cognition.ai|www.cognition.ai> それからしばらく経ったこともあって、X上でもチラホラと日本企業におけるDevin採用報告が聞こえてくるようになり、「こんなタスクには使えた:laughing:」「簡単なタスクにハマり続けて使",
    username: "企業テックブログRSS",
    icons: {
      image_36: "https://a.slack-edge.com/80588/img/services/rss_36.png",
      image_48: "https://a.slack-edge.com/80588/img/services/rss_48.png",
      image_72: "https://a.slack-edge.com/80588/img/services/rss_72.png",
    },
    type: "message",
    ts: "1740281317.858319",
    bot_id: "B06PX9ZK4E6",
    blocks: [
      {
        type: "rich_text",
        block_id: "30SvA",
        elements: [
          {
            type: "rich_text_section",
            elements: [
              {
                type: "link",
                url: "https://blog.generative-agents.co.jp/entry/with-devin",
                text: "Devinを導入して1ヶ月経ったので、人間とAIとでどのような開発の役割分担をするべきか振り返ってみる | Generative Agents Tech Blog",
              },
              {
                type: "text",
                text: "\nこんにちは、ジェネラティブエージェンツの西見です。 「完全自律型AIエンジニア」という触れ込みと、その印象的なティザー動画で一躍有名になったDevinが、2024年12月10日にGAしました。 ",
              },
              {
                type: "link",
                url: "http://www.cognition.ai",
                text: "www.cognition.ai",
              },
              {
                type: "text",
                text: " それからしばらく経ったこともあって、X上でもチラホラと日本企業におけるDevin採用報告が聞こえてくるようになり、「こんなタスクには使えた",
              },
              {
                type: "emoji",
                name: "laughing",
                unicode: "1f606",
              },
              {
                type: "text",
                text: "」「簡単なタスクにハマり続けて使",
              },
            ],
          },
        ],
      },
    ],
    channel: "C06PQMHGXK8",
    event_ts: "1740281317.858319",
    channel_type: "channel",
  },
  type: "event_callback",
  event_id: "Ev08E5VCK0MD",
  event_time: 1740281317,
  authorizations: [
    {
      enterprise_id: null,
      team_id: "T06QL3FF0P2",
      user_id: "U06PXCP1YH0",
      is_bot: true,
      is_enterprise_install: false,
    },
  ],
  is_ext_shared_channel: false,
  event_context:
    "4-eyJldCI6Im1lc3NhZ2UiLCJ0aWQiOiJUMDZRTDNGRjBQMiIsImFpZCI6IkEwNlBRUDVUVDYyIiwiY2lkIjoiQzA2UFFNSEdYSzgifQ",
};

describe("Package media-types", () => {
  describe("payload schema", () => {
    describe("successfully", () => {
      describe("event_callback", () => {
        it("returns CallbackEventMedia", () => {
          const article = Builder.get(ArticleFactory).build();

          const media = new SlackCallbackMedia({
            model: article,
            channel: Builder.get(StringFactory(10, 10)).build(),
          });
          const actual1 = callbackEventSchema.parse(sample);
          const actual2 = callbackEventSchema.parse(sample2);

          console.log(actual1);
          console.log(actual2);
        });
      });
    });
  });
});
