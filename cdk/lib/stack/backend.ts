import { Construct } from "constructs";
import { Auth } from "../construct/auth";
import { Api } from "../construct/api";
import { CfnOutput, Fn, Stack, StackProps } from "aws-cdk-lib";

export class Backend extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const auth = new Auth(this, "Auth");
    const api = new Api(this, "Api", { userPoolId: auth.userPool.userPoolId });

    // outputs
    {
      new CfnOutput(this, "UserPoolId", {
        value: auth.userPool.userPoolId,
      });
      new CfnOutput(this, "UserPoolWebClientId", {
        value: auth.userPoolClient.userPoolClientId,
      });
      new CfnOutput(this, "Api endpoint", {
        value: Fn.join("", ["https://", api.eventsApi.attrDnsHttp, "/event"]),
      });
    }
  }
}
