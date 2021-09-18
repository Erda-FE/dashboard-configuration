import agentUse from 'superagent-use';
import agent from 'superagent';

const superagent = agentUse(agent);

/**
 * 获取cookies对象，传入key时获取单个字段
 * @param 需要获取的cookie key
 */
export function getCookies(key) {
  const cookies = {};
  window.document.cookie.split(';').forEach((item) => {
    const [k, v] = item.split('=');
    cookies[k.trim()] = v && v.trim();
  });
  return key ? cookies[key] : cookies;
}


/**
 * set accept header
 */
function setHeader(req) {
  req.set('Accept', 'application/vnd.dice+json;version=1.0');
  req.set('Lang', localStorage.getItem('dashboardLang') === 'zh' ? 'zh-CN' : 'en-US');
  if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(req.method)) {
    const token = getCookies('OPENAPI-CSRF-TOKEN');
    if (token) {
      req.set('OPENAPI-CSRF-TOKEN', token);
    }
  }
  return req;
}


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

superagent.use(setHeader);
superagent.use(superagentPromisePlugin);

export default superagent;
