const sinon = require("sinon");
const { expect } = require("chai");
const { promiseHelper } = require("../helpers");

const middy = require("@middy/core");
const metrics = require("@middy/cloudwatch-metrics");
const captureCorrelationIds = require("@dazn/lambda-powertools-middleware-correlation-ids");

describe(`When we use cloudwatch-metrics Impl. from @middy/core version 2`, () => {
  const awsEmbeddedMetrics = require("aws-embedded-metrics");
  const sandbox = sinon.createSandbox();

  const metricsLoggerMock = {
    flush: sandbox.stub(),
    setNamespace: sandbox.stub(),
    setDimensions: sandbox.stub(),
  };
  const createMetricsLoggerStub = sandbox
    .stub(awsEmbeddedMetrics, "createMetricsLogger")
    .returns(metricsLoggerMock);

  afterEach(() => {
    sandbox.restore();
  });
  describe(`AND correlation-ids middleware form @dazn/lambda-powertools-middleware-correlation-ids`, () => {
    it(`it should add a MetricsLogger instance on context.netrics BUT it Throws Error: Timeout exceeded. For async tests and hooks, ensure "done() is called; if returning a Promise, ensure it resolves." `, async function () {
      const handler = async () => {
        return {};
      };

      const middleware = (request) => {
        expect(createMetricsLoggerStub.called).to.be.true;
        expect(request.context).to.be.deep.equal({
          metrics: metricsLoggerMock,
        });
        return Promise.resolve();
      };
      const wrapped = middy(handler)
        .use(metrics())
        .before(middleware)
        .use(captureCorrelationIds({ sampleDebugLogRate: parseFloat("0.01") }));

      await promiseHelper(wrapped)({}, {});
      // Throws Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves. (/home/achilles/my-middy-middlewares/v1/test/cloutwatchMetricsUnderTest.js)
    });
  });
});
