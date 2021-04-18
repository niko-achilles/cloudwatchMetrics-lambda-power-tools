const sinon = require("sinon");
const { expect } = require("chai");

const middy = require("@middy/core");
const captureCorrelationIds = require("@dazn/lambda-powertools-middleware-correlation-ids");
const metrics = require("@middy/cloudwatch-metrics");

describe(`When we use cloudwatch-metrics Impl. from @middy/core version 2`, () => {
  const awsEmbeddedMetrics = require("aws-embedded-metrics");
  const sandbox = sinon.createSandbox();

  const metricsLoggerMock = {
    flush: sandbox.stub(),
    setNamespace: sandbox.stub(),
    setDimensions: sandbox.stub(),
  };
  const createMetricsLoggerStub = sinon
    .stub(awsEmbeddedMetrics, "createMetricsLogger")
    .returns(metricsLoggerMock);

  afterEach(() => {

    sandbox.restore();
  });
  describe(`AND correlation-ids middleware form @dazn/lambda-powertools-middleware-correlation-ids`, () => {
    it(`it should add a MetricsLogger instance on context.metrics BUT it fails with TypeError next is not a function`, async function () {
      const handler = async () => {};

      const middleware = (request) => {
        expect(createMetricsLoggerStub.called).to.be.true;
        expect(request.context).to.be.deep.equal({
          metrics: metricsLoggerMock,
        });
      };

      const wrapped = middy(handler)
        .use(metrics())
        .before(middleware)
        .use(captureCorrelationIds({ sampleDebugLogRate: parseFloat("0.01") }));

      try {
        await wrapped();
      } catch (error) {
        expect(error).to.be.instanceOf(TypeError);
        expect(error.message).to.be.equal("next is not a function");
      }
    });
  });
});
