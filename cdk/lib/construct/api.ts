import { Construct } from "constructs";
import { aws_appsync as appsync } from "aws-cdk-lib";

export class Api extends Construct {
  public readonly eventsApi: appsync.CfnApi;
  public readonly namespace: appsync.CfnChannelNamespace;
  public readonly apiKey: appsync.CfnApiKey;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // using L1 constructs here..
    // no L2 constructs are available at the moment since the feature was announced recently.

    const api = new appsync.CfnApi(this, "EventsApi", {
      name: "MyEventsApi",
      eventConfig: {
        authProviders: [
          {
            authType: "API_KEY",
          },
        ],
        connectionAuthModes: [{ authType: "API_KEY" }],
        defaultPublishAuthModes: [{ authType: "API_KEY" }],
        defaultSubscribeAuthModes: [{ authType: "API_KEY" }],
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

    const apiKey = new appsync.CfnApiKey(this, "MyCfnApiKey", {
      apiId: api.attrApiId,
    });

    this.eventsApi = api;
    this.namespace = namespace;
    this.apiKey = apiKey;
  }
}
