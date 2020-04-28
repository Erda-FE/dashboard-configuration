import agentUse from 'superagent-use';
import agent from 'superagent';

const superagent = agentUse(agent);

function endPromise(req) {
  const _Promise = Promise;

  return new _Promise((resolve, reject) => {
    req.end((err, res) => {
      const error = err || res.error;
      if (error) {
        if (res) {
          error.status = res.status;
          if (res.text !== undefined && res.text !== '') {
            error.message = res.text;
          }
        }
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
}

function then(...args) {
  const promise = endPromise(this);
  return promise.then(...args);
}

function _catch(...args) {
  const promise = endPromise(this);
  return promise.catch(...args);
}

/**
 * Adds req.then and req.catch methods
 * @param {Object} req
 * @return {Object} req
 */
function superagentPromisePlugin(req) {
  req.then = then;
  req.catch = _catch;
  return req;
}

/**
 * Patches superagent so that every request has req.then and req.catch methods
 * @param {Object} superagent
 * @return {Object} superagent
 */
superagentPromisePlugin.patch = function patch(sa) {
  sa.Request.prototype.then = then;
  sa.Request.prototype.catch = _catch;
  return sa;
};

superagent.use(superagentPromisePlugin);

export default superagent;
