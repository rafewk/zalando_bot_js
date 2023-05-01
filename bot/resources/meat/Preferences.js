import productEndpoints from '../data/productEndpoints.json' assert { type: "json" };
import productFilterParams from '../data/productFilterParams.json' assert { type: "json" };
import enquirer from 'enquirer';

export default class Preferences {
    gender;
    productType;
    size;
    sortType;
    priceMin;
    priceMax;
    howManyProducts;

    sortingTypes = Object.keys(productFilterParams.sort);
    genders = Object.keys(productEndpoints);
    productsForGender = [];

    #getProductsForGender() {
        Object.keys(productEndpoints[this.gender]).forEach(($key) => {
            this.productsForGender.push($key);
        });
    }

    async selectGender() {
        let userPick = new enquirer.Select({
            message: "Pick gender to searach products for: \n",
            choices: this.genders
        });
        this.gender = await userPick.run();
    }

    async selectProductType() {
        this.#getProductsForGender();
        let userPick = new enquirer.Select({
            message: "Pick product type: \n",
            choices: this.productsForGender
        });
        this.productType = await userPick.run();
    }

    async selectSortType() {
        let userPick = new enquirer.Select({
            message: "Pick sorting type: \n",
            choices: this.sortingTypes
        });
        this.sortType = await userPick.run();
    }

    async enterPriceMin() {
        await enquirer.prompt({
            type: "input",
            name: "priceMin",
            message: "Type a minimum price of products (only number): \n",
            validate: (answer) => {
                if(isNaN(answer)) {
                    return "Please enter a valid price: \n"
                } else {
                    return true
                }
            }
        }).then(($input) => {
            this.priceMin = $input.priceMin;
        });
    }

    async enterPriceMax() {
        await enquirer.prompt({
            type: "input",
            name: "priceMax",
            message: "Type a maximum price of products (only number): \n",
            validate: (answer) => {
                if(isNaN(answer)) {
                    return "Please enter a valid price: \n"
                } else {
                    return true
                }
            }
        }).then(($input) => {
            this.priceMax = $input.priceMax;
        });
    }

    async enterSize() {
        await enquirer.prompt({
            type: "input",
            name: "size",
            message: "Type products size: \n",
        }).then(($input) => {
            this.size = $input.size;
        });
    }

    async enterHowMany() {
        await enquirer.prompt({
            type: "input",
            name: "howMany",
            message: "Type a number of products you want to see: \n",
            validate: (answer) => {
                if(isNaN(answer)) {
                    return "Please enter a valid number: \n"
                } else {
                    return true
                }
            }
        }).then(($input) => {
            this.howManyProducts = $input.howMany;
        });
    }
}