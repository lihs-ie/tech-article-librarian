import { Category } from "domains/article";
import { Map } from "immutable";

const slackChannels = {
  C06PGNNCKAT: "backend-high",
  C06QL3JTEKS: "backend-middle",
  C06PGNPQ86B: "backend-low",
  C06PQLHMNJJ: "frontend-high",
  C06PZP7P5B6: "frontend-middle",
  C06PX6GKNP5: "frontend-low",
  C06PQMHGXK8: "mixed",
  C070VB7S85B: "flutter",
  C08DEDCN7LL: "ai",
  C08DBQZE9V1: "infrastructure",
  C08F7PG9GQG: "scala",
  C08EG0CG9NH: "ddd",
} as const;

export const acl = {
  line: {
    CHANNEL_ACCESS_TOKENS: Map<Category, string>({
      [Category.OTHER]: process.env.ACL_LINE_CHANNEL_ACCESS_TOKEN_MIXED || "",
      [Category.BACKEND]: process.env.ACL_LINE_CHANNEL_ACCESS_TOKEN || "",
      [Category.FRONTEND]: process.env.ACL_LINE_CHANNEL_ACCESS_TOKEN || "",
      [Category.INFRASTRUCTURE]:
        process.env.ACL_LINE_CHANNEL_ACCESS_TOKEN_MIXED || "",
      [Category.ARTIFICIAL_INTELLIGENCE]:
        process.env.ACL_LINE_CHANNEL_ACCESS_TOKEN_MIXED || "",
      [Category.MOBILE_APPLICATION]:
        process.env.ACL_LINE_CHANNEL_ACCESS_TOKEN || "",
      [Category.SCALA]: process.env.ACL_LINE_CHANNEL_ACCESS_TOKEN || "",
      [Category.DDD]: process.env.ACL_LINE_CHANNEL_ACCESS_TOKEN || "",
    }),
    USER_ID: process.env.ACL_LINE_USER_ID || "",
    API_ENDPOINT: process.env.ACL_LINE_API_ENDPOINT || "https://api.line.me/v2",
    image: {
      NO_IMAGE_URL: process.env.ACL_LINE_NO_IMAGE_URL || "",
      BACKGROUND_COLORS: Map({
        [Category.BACKEND]: "#b0c4de",
        [Category.FRONTEND]: "#FF6347",
        [Category.INFRASTRUCTURE]: "#fafad2",
        [Category.ARTIFICIAL_INTELLIGENCE]: "#9acd32",
        [Category.MOBILE_APPLICATION]: "#afeeee",
        [Category.SCALA]: "#DC322F",
        [Category.DDD]: "#4682B4",
        [Category.OTHER]: "#FFFFFF",
      }),
    },
  },
  slack: {
    CHANNELS: slackChannels,
    CATEGORIES: Map<keyof typeof slackChannels, Category>({
      C06PGNNCKAT: Category.BACKEND,
      C06QL3JTEKS: Category.BACKEND,
      C06PGNPQ86B: Category.BACKEND,
      C06PQLHMNJJ: Category.FRONTEND,
      C06PZP7P5B6: Category.FRONTEND,
      C06PX6GKNP5: Category.FRONTEND,
      C08DEDCN7LL: Category.ARTIFICIAL_INTELLIGENCE,
      C06PQMHGXK8: Category.OTHER,
      C08DBQZE9V1: Category.INFRASTRUCTURE,
      C08F7PG9GQG: Category.SCALA,
      C08EG0CG9NH: Category.DDD,
    }),
  },
  firebase: {
    APP_ID: process.env.ACL_FIREBASE_APP_ID || "",
    USER_ID: process.env.ACL_FIREBASE_USER_ID || "",
    SERVICE_ACCOUNT_KEY: process.env.ACL_FIREBASE_SERVICE_ACCOUNT_KEY || "",
  },
  ogp: {
    USER_AGENT: process.env.ACL_OGP_USER_AGENT || "",
  },
} as const;
