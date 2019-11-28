
'use strict'

const puppeteer = require('puppeteer')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const PuppeteerHar = require('puppeteer-har')

const width = 1280
const height = 720
const delayMS = 5

let browser
let page
let har

// threshold is the difference in pixels before the snapshots dont match
const toMatchImageSnapshot = configureToMatchImageSnapshot({
	customDiffConfig: { threshold: 2 },
	noColors: true,
})
expect.extend({ toMatchImageSnapshot })

beforeAll( async() => {
	browser = await puppeteer.launch({ headless: false, slowMo: delayMS, args: [`--window-size=${width},${height}`] })
	page = await browser.newPage()
	har = new PuppeteerHar(page)
	await page.setViewport({ width, height })
})

//afterAll( () => browser.close() ) // https://github.com/GoogleChrome/puppeteer/issues/561

describe('register', () => {
	test('register user', async done => {
		// start generating a trace file
		await page.tracing.start({path: 'trace/add_one_item_har.json',screenshots: true})
		await har.start({ path: 'trace/add_one_item_trace.har' })
		// ARRANGE
		await page.goto('http://localhost:5000', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:5000/tech/register', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/empty_list.png' })

		// ACT
		// complete the form and click submit
		await page.type('input[name=user]', 'dodo')
		await page.type('input[name=email]', 'dodo@gmail.com')
		await page.type('input[name=pass]', '123456')
		await page.click('input[type=submit]')
		await page.waitForSelector('nav')
		// await page.waitFor(1000) // sometimes you need a second delay

		// ASSERT
		const title = await page.title()
		expect(title).toBe('Dashboard')

		// extracting the text inside the first H1 element on the page
		const heading = await page.evaluate( () => {
			const dom = document.querySelector('nav .nav-container a span.hide-md')
			return dom.innerText
		})
		expect(heading).toBe('Domestic Repair')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)
})