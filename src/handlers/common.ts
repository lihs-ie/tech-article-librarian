import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const lambda = new LambdaClient();

export const invokeLambda = async (
  functionName: string,
  payload: Record<string, unknown>
): Promise<void> => {
  const command = new InvokeCommand({
    FunctionName: functionName,
    InvocationType: "Event",
    Payload: Buffer.from(JSON.stringify(payload)),
  });

  await lambda.send(command);
  console.log(`Lambda invoked: ${functionName}.`);
};
