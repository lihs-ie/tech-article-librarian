import { z } from "zod";

export const challengePayloadScheme = z.object({
  token: z.string(),
  challenge: z.string(),
  type: z.literal("url_verification"),
});

export type ChallengeVerificationEvent = z.infer<typeof challengePayloadScheme>;

const iconsSchema = z.object({
  image_36: z.string().optional(),
  image_48: z.string().optional(),
  image_72: z.string().optional(),
});

const authorizationSchema = z.object({
  enterprise_id: z.string().nullable(),
  team_id: z.string(),
  user_id: z.string(),
  is_bot: z.boolean(),
  is_enterprise_install: z.boolean(),
});

const emojiRichTextElementSchema = z.object({
  type: z.literal("emoji"),
  name: z.string(),
  unicode: z.string().optional(),
});

const linkRichTextElementSchema = z.object({
  type: z.literal("link"),
  url: z.string().url(),
  text: z.string().optional(),
});

const textRichTextElementSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

const richTextSectionSchema = z.object({
  type: z.literal("rich_text_section"),
  elements: z.array(
    z.union([
      emojiRichTextElementSchema,
      linkRichTextElementSchema,
      textRichTextElementSchema,
    ])
  ),
});

const blockSchema = z.object({
  type: z.literal("rich_text"),
  block_id: z.string().min(1).max(255).optional(),
  elements: z.array(richTextSectionSchema),
});

const messageSchema = z.object({
  type: z.literal("message"),
  text: z.string().optional(),
  blocks: z.array(blockSchema).default([]),
});

const messageEventSchema = z.object({
  type: z.literal("message"),
  event_ts: z.string(),
  user: z.string().optional(),
  ts: z.string(),
  channel: z.string(),
  subtype: z.enum(["message_changed", "bot_message"]).optional(),
  text: z.string().optional(),
  bot_id: z.string().optional(),
  icons: iconsSchema.optional(),
  message: messageSchema.optional(),
  blocks: z.array(blockSchema).optional(),
});

export const callbackEventSchema = z.object({
  token: z.string().min(1),
  api_app_id: z.string().min(1),
  type: z.literal("event_callback"),
  authorizations: z.array(authorizationSchema),
  event_context: z.string().min(1),
  event_id: z.string().min(1),
  event_time: z.number().int(),
  event: messageEventSchema,
});

export type MessageEvent = z.infer<typeof messageEventSchema>;

export type CallBackEventMedia = z.infer<typeof callbackEventSchema>;

export const payloadSchema = z.discriminatedUnion("type", [
  challengePayloadScheme,
  callbackEventSchema,
]);

export type Payload = z.infer<typeof payloadSchema>;
