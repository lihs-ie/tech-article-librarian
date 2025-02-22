import { payloadSchema } from "acl/slack/media-type";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { invokeLambda } from "./common";
import { presentation } from "config";

export const Handler = async (
  request: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | void> => {
  try {
    console.log(`Incoming request: ${JSON.stringify(request)}`);

    if (!request.body) {
      throw new Error("Invalid request.");
    }

    const retryCount = request.headers?.["X-Slack-Retry-Num"];
    if (retryCount && 1 < Number(retryCount)) {
      console.log(`Ignoring retry request: ${retryCount}.`);
      return { statusCode: 200, body: "Retry request ignored." };
    }

    const body = JSON.parse(request.body);

    const payload = payloadSchema.parse(body);

    switch (payload.type) {
      case "url_verification":
        return {
          statusCode: 200,
          body: JSON.stringify({ challenge: payload.challenge }),
        };

      case "event_callback":
        await invokeLambda(presentation.handler.names.PERSIST_ARTICLE, payload);
        return { statusCode: 200, body: "OK" };
    }
  } catch (error) {
    console.error(error);
    return { statusCode: 200, body: "Error occurred." };
  }
};
