import { App } from "aws-cdk-lib";
import "source-map-support/register";
import { Backend } from "../lib/stack/backend";
import { Frontend } from "../lib/stack/frontend";

const app = new App();

new Backend(app, `Backend`);
new Frontend(app, "Frontend");
