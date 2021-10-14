const fs0 = require('fs');
const fs = fs0.promises;
const { assert } = require('chai');

// describe('github', async function() {
//   it('should find hermione', async function() {
//     await this.browser.url('https://github.com/gemini-testing/hermione');
//     const title = await this.browser.$('#readme h1').getText();
//     assert.equal(title, 'Hermione');
//   });
// });

fs0.mkdirSync('screenshots', { recursive: true });

describe('github', function () {
  it('should find hermione', async function () {
    await this.browser.url('http://localhost:3000');

    // this.browser.waitUntil(() => this.browser.$('pre').isExisting(), { timeoutMsg: 'Appliction should render tag `pre`' })

    await fs.writeFile('screenshots/page-0.png', Buffer.from(await this.browser.takeScreenshot(), 'base64'));

    let json = await this.browser.$('pre').getText();
    assert.equal(json, 'null');

    await this.browser.$('button').click();
    await this.browser.waitUntil(async () => json !== await this.browser.$('pre').getText(), { timeoutMsg: 'Data should change' })

    await fs.writeFile('screenshots/page-1.png', Buffer.from(await this.browser.takeScreenshot(), 'base64'));

    json = await this.browser.$('pre').getText();
    assert.include(json, '[\n');
  });
});
