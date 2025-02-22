import {
  Adaptor,
  CallBackEventMedia,
  callbackSchema,
  MessageEvent,
} from "acl/slack";
import { container } from "providers";
import { Article } from "use-cases";
import { BlobPayloadInputTypes } from "@smithy/types";

const articleUseCase = container.get(Article);
const slackAdaptor = container.get(Adaptor);

const persist = async (event: MessageEvent) => {
  console.log(`Incoming event: ${JSON.stringify(event)}`);

  await articleUseCase.persist(
    slackAdaptor.getURL(event),
    slackAdaptor.getCategory(event),
    false
  );
};

export const Handler = async (
  payload: BlobPayloadInputTypes
): Promise<void> => {
  console.log(`Incoming payload: ${JSON.stringify(payload)}.`);

  try {
    const callbackMedia = callbackSchema.parse(payload);
    await persist(callbackMedia.event);
  } catch (error) {
    console.error(`Failed to process event: ${error}.`);
  }
};
