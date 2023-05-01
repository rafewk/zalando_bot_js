import { load } from 'cheerio';
import axios from 'axios';
import ora from 'ora';
import fakeUa from 'fake-useragent';
import enquirer from 'enquirer';
import productEndpoints from '../data/productEndpoints.json' assert { type: "json" };
import productFilterParams from '../data/productFilterParams.json' assert { type: "json" };
import userProfiles from '../data/userProfiles.json' assert { type: "json"}

export default class Scraper {
    baseUrl = 'https://www.zalando.pl';
    fullUrl;
    doWeLoad;
    profiles = Object.keys(userProfiles);
    productLinkTagsLocator = 'div[data-zalon-partner-target] article[role="link"] a[data-card-type]';

    scrapedLinks = [];

    async ifLoadProfile() {
        let userPick = new enquirer.Select({
            message: "Load profile?: \n",
            choices: ['YES', 'NO']
        })
        this.doWeLoad = await userPick.run();
        if(this.doWeLoad === 'YES' && Object.keys(userProfiles).length > 0) {
            await this.loadProfile();
        } else if (this.doWeLoad === 'YES' && Object.keys(userProfiles).length === 0) {
            console.log('!!! NO PROFILES AVAILABLE !!!\n => You will need to create some profile to use it later.');
        }
    }

    async createUrl(gender, productType, size, priceMin, priceMax, sortType) {
        this.fullUrl = 
            `${this.baseUrl}/${productEndpoints[gender][productType]}/${productFilterParams.size}${size}/?${productFilterParams.price.from}${priceMin}&${productFilterParams.price.to}${priceMax}&${productFilterParams.sort[sortType]}`;
    }

    async loadProfile() {
        let userPick = new enquirer.Select({
            message: "Pick profile: \n",
            choices: this.profiles
        });
        this.fullUrl = userProfiles[await userPick.run()];
    }

    async getProductsLinks() {
        const spinner = ora('Getting products...').start();
        await axios.get(this.fullUrl, {
            headers: {
                'User-Agent': fakeUa(),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'pl-PL,en;q=0.7'
            }
        }).then(($response) => {
            if($response.status < 400) {
                const $ = load($response.data);
                $(this.productLinkTagsLocator).each((_, tag) => {
                    if($(tag).attr('href').includes('.html')) {
                        this.scrapedLinks.push($(tag).attr('href'));
                    }
                });
                spinner.succeed(`Products fetched: ${this.scrapedLinks.length}`);
            } else {
                spinner.fail('Request error.')
                throw new Error(`Response has status code: ${$response.status}`);
            }
        }).catch(error => {
            console.log(error);
        });
    }
}