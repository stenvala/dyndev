import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GuideNavService } from '@guide/services';

import hljs from 'highlight.js';

@Component({
  templateUrl: './guide-route-cdk.component.html',
  styleUrls: ['./guide-route-cdk.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideRouteCdkComponent implements OnInit {
  cdkCode = CDK_CODE;
  constructor(private guideNav: GuideNavService) {}

  ngOnInit(): void {
    this.guideNav.setSideNav();
  }

  ngAfterViewInit() {
    hljs.highlightAll();
  }
}

const CDK_CODE = `import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

const TABLE_NAME = "demo";

export class MainTableDynamo {  
  
  table: dynamodb.Table;

  constructor(scope: cdk.Stack, props: CdkProps) {
    this.table = new dynamodb.Table(scope, "DemoTable", {
      partitionKey: {
        name: "PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: dynamodb.AttributeType.STRING,
      },
      tableName: TABLE_NAME,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      timeToLiveAttribute: "destroy_time",
    });

    this.table.addGlobalSecondaryIndex({
      indexName: "GSI1",
      partitionKey: {
        name: "GSI1PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "GSI1SK",
        type: dynamodb.AttributeType.STRING,
      },
    });

    this.table.addGlobalSecondaryIndex({
      indexName: "GSI2",
      partitionKey: {
        name: "GSI2PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "GSI2SK",
        type: dynamodb.AttributeType.STRING,
      },
    });

    this.table.addGlobalSecondaryIndex({
      indexName: "GSI3",
      partitionKey: {
        name: "GSI3PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "GSI3SK",
        type: dynamodb.AttributeType.STRING,
      },
    });

    new cdk.CfnOutput(scope, "DemoTableName", {
      value: this.table.tableName,
    });
  }
}`;
