const PuppeteerEnvironment = require('jest-environment-puppeteer');
const option = require('./dev-server.ignore');

class CustomEnvironment extends PuppeteerEnvironment {
  async setup() {
    await super.setup();
    const { page } = this.global;
    const url = `http://${option.frontUrl}`;
    this.global.baseUrl = url;
    await page.goto(`${url}/api/mock-login?email=xiajingsi@terminus.io`);
  }

  async teardown() {
    await super.teardown();
  }
}

module.exports = CustomEnvironment;

