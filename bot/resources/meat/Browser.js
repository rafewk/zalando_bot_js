import { chromium } from 'playwright';
import enquirer from 'enquirer';
import Scraper from './Scraper.js';

export default class Browser {
    scrap = new Scraper();

    async runBrowser(ifLogin, linksArray, howManyPrefered) {
        const browser = await chromium.launch({ headless: false });
        const context = await browser.newContext();
        if(ifLogin === 'YES'){
            const page = await context.newPage();
            await page.setViewportSize({width: 1920, height: 1080});
            await page.goto(this.scrap.baseUrl);
            await page.waitForLoadState('networkidle');
        }
        if(howManyPrefered >= linksArray.length) {
            for(const link of linksArray) {
                const page = await context.newPage();
                await page.setViewportSize({width: 1920, height: 1080});
                await page.goto(link)
                await page.waitForLoadState('networkidle');
            }
        } else {
            for(let i = 0; i < howManyPrefered; i++) {
                const page = await context.newPage();
                await page.setViewportSize({width: 1920, height: 1080});
                await page.goto(linksArray[i]);
                await page.waitForLoadState('networkidle');
            }
        }
        await this.#close(context, browser);
    }

    async #close(context, browser) {
        await enquirer.prompt({
            type: "input",
            name: "close",
            message: "Finish your shopping and type 'close' to exit: \n",
            validate: (answer) => {
                if(answer.toLowerCase() !== 'close') {
                    return "Type 'close' to exit: \n"
                } else {
                    return true
                }
            }
        }).then(() => {
            context.close();
            browser.close();
        });
    }
}