import { Construct } from "constructs";
import { aws_cognito as cognito, RemovalPolicy } from "aws-cdk-lib";

export class Auth extends Construct {
  readonly userPool: cognito.IUserPool;
  readonly userPoolClient: cognito.IUserPoolClient;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const userPool = new cognito.UserPool(this, "UserPool", {
      autoVerify: {
        email: true,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      signInAliases: { email: true },
      selfSignUpEnabled: true,
    });

    const client = userPool.addClient("Client", {
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });

    this.userPool = userPool;
    this.userPoolClient = client;
  }
}
