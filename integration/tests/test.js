const { assert } = require('chai');

describe('github', async function() {
    it('should find hermione', async function() {
        await this.browser.url('https://github.com/gemini-testing/hermione');

        const title = await this.browser.$('#readme h1').getText();
        assert.equal(title, 'Hermione');
    });
});
