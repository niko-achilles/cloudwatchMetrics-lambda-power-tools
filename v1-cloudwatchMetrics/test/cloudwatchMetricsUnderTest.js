const sinon = require("sinon");
const { expect } = require("chai");
const { promiseHelper } = require("../helpers");

const middy = require("@middy/core");
const metrics = require("../cloudwatch-metrics");
const captureCorrelationIds = require("@dazn/lambda-powertools-middleware-correlation-ids");

describe(`When we use cloudwatch-metrics Impl. according to spec. of @middy/core version 1.x`, () => {
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
  describe(`AND correlation-ids middleware from @dazn/lambda-powertools-middleware-correlation-ids`, () => {
    it(`it should add a MetricsLogger instance on context.metrics`, async function () {
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
    });
    it(`should call the middlewares respecting the order of the middy specification`, async function () {
      const middlewareMock = () => {
        return {
          before: sandbox.stub().resolves(),
          after: sandbox.stub().resolves(),
        };
      };

      const handler = async () => {
        return {};
      };

      const middlewareMockInstance = middlewareMock();

      const wrapped = middy(handler)
        .use(metrics())
        .use(captureCorrelationIds({ sampleDebugLogRate: parseFloat("0.01") }))
        .use(middlewareMockInstance);

      await promiseHelper(wrapped)({}, {});

      expect(middlewareMockInstance.before.calledOnce).to.be.true;
      expect(middlewareMockInstance.after.calledOnce).to.be.true;
    });
  });
});
