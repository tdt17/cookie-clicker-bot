import { getNumber, wait } from "./utils.js";

export async function startGame(page) {
    let clickOnlyOnce = true
    while(true) {
      const optionsButton = await page.waitForSelector('.subButton')
      const text = await optionsButton.evaluate((el) => el.textContent)
      if(text === 'Optionen') {
        break;
      } else {
        if (clickOnlyOnce) {
          try {
            const languageButton = await page.waitForSelector('[id="langSelect-DE"]', {timeout: 100})
            languageButton.click()
            clickOnlyOnce = false
          }catch(e) {}
        }
      }
      await wait(100)
    }
}

export class Game {
  constructor(page) {
    this.page = page
  }

  async init() {
    this.dom = {
      products: await this.page.waitForSelector('#products'),
      upgrades: await this.page.waitForSelector('#upgrades'),
      cookieButton: await this.page.waitForSelector('#bigCookie'),
    }
    await this.refresh()
  }

  async click(count, waitMs=10) {
    for (let index = 0; index < count; index++) {
      await wait(waitMs)
      this.dom.cookieButton.click()
    }
  }

  async refresh() {
    const [_, cookieTest, cookiePerSecondText] = (await this.page.evaluate(() => document.querySelector('#cookies').textContent)).match(/(.+)kekse.+:(.+)/i) || []
    this.cookies = getNumber(cookieTest)
    this.cookiesPerSecond = getNumber(cookiePerSecondText, 0)
    this.products = await this.dom.products.evaluate(el => {
      const products = Array.from(el.querySelectorAll('.product'))
      return products.map(el => ({
        id: el.id,
        enabled: el.className.includes('enabled'),
        unlocked: el.className.includes('unlocked'),
        price: el.querySelector('.price').textContent,
        owned: el.querySelector('.owned').textContent,
      }))
    })

    this.upgrades = await this.dom.upgrades.evaluate(el => {
      const upgrades = Array.from(el.querySelectorAll('.upgrade'))
      return upgrades.map(el => ({
        id: el.id,
        enabled: el.className.includes('enabled'),
        price: el.querySelector('.price').textContent,
      }))
    })

    this.products.forEach(p => Object.assign(p, {price: getNumber(p.price), owned: getNumber(p.owned, 0)}))
    this.upgrades.forEach(p => Object.assign(p, {price: getNumber(p.price)}))

    console.log(this.products)
    console.log(this.upgrades)
  }
}