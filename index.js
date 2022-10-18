import puppeteer from 'puppeteer';
import { startGame, Game } from './game.js';
import { load, save, wait } from './utils.js';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
    defaultViewport: {width: 1400, height: 800}
  });
  const [page] = await browser.pages();
  await page.goto('https://orteil.dashnet.org/cookieclicker/', {waitUntil: 'domcontentloaded'});
  await load(page)

  await startGame(page)
  const game = new Game(page)
  await game.init()

  debugger;

  await wait(60 * 1000)
  await save(page)
  await browser.close();
})();