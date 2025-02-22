import { z } from "zod";

export const challengePayloadScheme = z.object({
  token: z.string(),
  challenge: z.string(),
  type: z.literal("url_verification"),
});

export type ChallengeVerificationEvent = z.infer<typeof challengePayloadScheme>;

const richTextSectionElementSchema = z.object({
  type: z.enum(["text", "link"]),
  text: z.string().optional(),
  url: z.string().url().optional(),
});

const richTextSectionSchema = z.object({
  type: z.literal("rich_text_section"),
  elements: z.array(richTextSectionElementSchema),
});

const blockSchema = z.object({
  type: z.literal("rich_text"),
  elements: z.array(richTextSectionSchema),
});

const messageEventSchema = z.object({
  type: z.literal("message"),
  text: z.string().optional(),
  blocks: z.array(blockSchema).default([]),
  channel: z.string(),
});

export type MessageEvent = z.infer<typeof messageEventSchema>;

export const callbackSchema = z.object({
  type: z.literal("event_callback"),
  event: messageEventSchema,
});

export type CallBackEventMedia = z.infer<typeof callbackSchema>;

export type Response = {
  statusCode: number;
  body: string;
};

export const payloadSchema = z.discriminatedUnion("type", [
  challengePayloadScheme,
  callbackSchema,
]);

export type Payload = z.infer<typeof payloadSchema>;
