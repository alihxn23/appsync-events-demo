import { Construct } from "constructs";
import { aws_appsync as appsync } from "aws-cdk-lib";

interface ApiProps {
  userPoolId: string;
}

export class Api extends Construct {
  public readonly eventsApi: appsync.CfnApi;
  public readonly namespace: appsync.CfnChannelNamespace;

  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id);

    // using L1 constructs here..
    // no L2 constructs are available at the moment since the feature was announced recently.

    const api = new appsync.CfnApi(this, "EventsApi", {
      name: "MyEventsApi",
      eventConfig: {
        authProviders: [
          {
            authType: "AMAZON_COGNITO_USER_POOLS",
            cognitoConfig: {
              awsRegion: "us-east-1", // making an assumption
              userPoolId: props.userPoolId,
            },
          },
        ],
        connectionAuthModes: [{ authType: "AMAZON_COGNITO_USER_POOLS" }],
        defaultPublishAuthModes: [{ authType: "AMAZON_COGNITO_USER_POOLS" }],
        defaultSubscribeAuthModes: [{ authType: "AMAZON_COGNITO_USER_POOLS" }],
      },
    });

    const namespace = new appsync.CfnChannelNamespace(
      this,
      "EventApiNamespace",
      {
        apiId: api.attrApiId,
        name: "default",
      }
    );

    this.eventsApi = api;
    this.namespace = namespace;
  }
}
