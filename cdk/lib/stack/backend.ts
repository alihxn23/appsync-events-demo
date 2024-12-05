import { Construct } from "constructs";
import { Api } from "../construct/api";
import { CfnOutput, Fn, Stack, StackProps } from "aws-cdk-lib";

export class Backend extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new Api(this, "Api");

    // outputs
    {
      new CfnOutput(this, "Api endpoint", {
        value: Fn.join("", ["https://", api.eventsApi.attrDnsHttp, "/event"]),
      });
      new CfnOutput(this, "Api key", {
        value: api.apiKey.attrApiKey
      });
    }
  }
}
