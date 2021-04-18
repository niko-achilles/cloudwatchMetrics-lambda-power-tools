const util = require("util");
const promisify = util.promisify;

function promiseHelper(handler) {
  return promisify(handler);
}

module.exports = {
  promiseHelper,
};
