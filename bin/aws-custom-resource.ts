#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsCustomResourceStack } from '../lib/aws-custom-resource-stack';

const app = new cdk.App();
new AwsCustomResourceStack(app, 'AwsCustomResourceStack');