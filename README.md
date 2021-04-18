# Introduction

[Middy 1.x](https://github.com/middyjs/middy/tree/1.x),  
`The stylish Node.js middleware engine for AWS Lambda` is deprecated

[dazn-lambda-power-tools ](https://github.com/getndazn/dazn-lambda-powertools),  
`a collection of middy middlewares` use the `Middy 1.x version`

[Middy 2.x](https://github.com/middyjs/middy/tree/main) provides a cloudwatch-metrics Implementation [link](https://github.com/middyjs/middy/tree/main/packages/cloudwatch-metrics)

This repository is created in order to test the usage of `Middy 2.x cloudwatch-metrics Implementation` with chosen `middy mniddlewares` from the `dazn power tools collection`.

Because of the incompatibility between `Middy 2.x` and `Middy 1.x` a cloudwatch-metrics Implementation for `Middy 1.x` is created, that enables the usage with chosen middlewares from `dazn power tools collection`

## TESTS

- [v1](v1/) : uses `Middy version 1.5.2` and `@dazn/lambda-powertools-middleware-correlation-ids` and `cloudwatch-metrics Impl. of middy version 2.0.1`

- [v2](v2/) : uses `Middy version 2.0.1` and `@dazn/lambda-powertools-middleware-correlation-ids` and `cloudwatch-metrics Impl. of middy version 2.0.1`

- [v1-cloudwatchMetrics](v1-cloudwatchMetrics/) : uses `Middy version 1.5.2` and `@dazn/lambda-powertools-middleware-correlation-ids` and created [cloudwatch-metrics.js](v1-cloudwatchMetrics/cloudwatch-metrics.js) compatible with `Middy version 1.5.2`  
  Follows _almost_ the implementation of middy 2.x [cloudwatch-metrics](https://github.com/middyjs/middy/tree/main/packages/cloudwatch-metrics)  
  Depends on: `aws-embedded-metrics` and
