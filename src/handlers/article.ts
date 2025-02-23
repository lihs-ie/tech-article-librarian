import { Adaptor, CallBackEventMedia, MessageEvent } from "acl/slack";
import { container } from "providers";
import { Article } from "use-cases";

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

export const Handler = async (payload: CallBackEventMedia): Promise<void> => {
  console.log(`Incoming payload: ${JSON.stringify(payload)}.`);

  if (payload.event.subtype === "message_changed") {
    console.log("Ignoring message_changed event.");
    return;
  }

  try {
    await persist(payload.event);
  } catch (error) {
    console.error(`Failed to process event: ${error}.`);
  }
};
