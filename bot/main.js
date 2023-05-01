import Creds from './resources/meat/Creds.js';
import Preferences from './resources/meat/Preferences.js';
import Scraper from './resources/meat/Scraper.js';
import Browser from './resources/meat/Browser.js';
import Profiles from './resources/meat/Profiles.js';
import userProfiles from './resources/data/userProfiles.json' assert { type: "json"}

const creds = new Creds();
const pref = new Preferences();
const scrap = new Scraper();
const browser = new Browser();
const profiles = new Profiles();

await scrap.ifLoadProfile()
await pref.enterHowMany();
if(scrap.doWeLoad === 'NO' || Object.keys(userProfiles).length === 0) {
    await pref.selectGender();
    await pref.selectProductType();
    await pref.selectSortType();
    await pref.enterPriceMin();
    await pref.enterPriceMax();
    await pref.enterSize();
    await scrap.createUrl(pref.gender, pref.productType, pref.size, pref.priceMin, pref.priceMax, pref.sortType);
    await profiles.ifSaveProfile(scrap.fullUrl);
}
await scrap.getProductsLinks();
if(scrap.scrapedLinks.length > 0) {
        await creds.doWeLogIn();
    if(creds.ifLogin === 'YES') {
        await creds.setEmail();
        await creds.setPassword();
    }
    browser.runBrowser(creds.ifLogin, scrap.scrapedLinks, pref.howManyProducts);
} else {
    console.log(' => NO PRODUCTS WERE FOUND');
}