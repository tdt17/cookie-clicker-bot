import * as fs from 'fs/promises'
import { join } from 'path';

const SAVES = './saves'
const PATHS = {
    saves: SAVES,
    cookies: join(SAVES, "cookies.json"),
    sessionStorage: join(SAVES, "sessionStorage.json"),
    localStorage: join(SAVES, "localStorage.json")
}

export async function save(page) {
    const cookies = JSON.stringify(await page.cookies());
    const sessionStorage = await page.evaluate(() =>JSON.stringify(sessionStorage));
    const localStorage = await page.evaluate(() => JSON.stringify(localStorage));
  
    await fs.mkdir(PATHS.saves, {recursive: true})

    await fs.writeFile(PATHS.cookies, cookies);
    await fs.writeFile(PATHS.localStorage, localStorage);
}

export async function load(page) {
    let cookies, sessionStorage, localStorage
    try {
        const cookiesString = await fs.readFile(PATHS.cookies);
        cookies = JSON.parse(cookiesString);
    
        const localStorageString = await fs.readFile(PATHS.localStorage);
        localStorage = JSON.parse(localStorageString);
    } catch (e) {
        console.log('could not load saves', e)
        return
    }

    await page.setCookie(...cookies);
  
    await page.evaluate((data) => {
      for (const [key, value] of Object.entries(data)) {
        localStorage[key] = value;
      }
    }, localStorage);
}

export const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms))

const TIMES = {
  million: 6,
  billion: 9,
  trillion: 12,
  quadrillion: 15,
  quintillion: 18,
  sextillion: 21,
  septillion: 24
}

export const getNumber = (str='', defaultValue) => parseFloat(str.replaceAll(',',''), 10) * (Math.pow(10, Object.entries(TIMES).find(([key]) => str.includes(key))?.[1] ?? 0)) || defaultValue
