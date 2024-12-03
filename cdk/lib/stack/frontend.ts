import { CfnOutput, Fn, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
  Distribution,
  OriginAccessIdentity,
  PriceClass,
} from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export class Frontend extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const siteBucket = new Bucket(this, "frontendBucket", {
      websiteIndexDocument: "index.html",
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
    });

    const oai = new OriginAccessIdentity(this, "oai");
    siteBucket.grantRead(oai);

    const distribution = new Distribution(this, "distribution", {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessIdentity(siteBucket, {
          originAccessIdentity: oai,
        }),
      },
      defaultRootObject: "index.html",
      priceClass: PriceClass.PRICE_CLASS_100,
    });

    new BucketDeployment(this, "deployWithInvalidation", {
      destinationBucket: siteBucket,
      sources: [Source.asset("../dist")],
      distribution: distribution,
      distributionPaths: ["/*"],
    });

    // outputs
    new CfnOutput(this, "distributionUrl", {
      value: Fn.join("", ["https://", distribution.distributionDomainName]),
    });
  }
}
