import fs from 'fs';
import enquirer from 'enquirer';

export default class Profiles {

    async addProfile(profileName, value) {
        fs.readFile('bot/resources/data/userProfiles.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const jsonData = JSON.parse(data);
            jsonData[profileName] = value;
            fs.writeFile('bot/resources/data/userProfiles.json', JSON.stringify(jsonData, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        });
    }

    async deleteProfile(profileName) {
        fs.readFile('bot/resources/data/userProfiles.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
        const jsonData = JSON.parse(data);
        delete jsonData[profileName];
        fs.writeFile('bot/resources/data/userProfiles.json', JSON.stringify(jsonData, null, 4), (err) => {
            if (err) {
                console.error(err);
                eturn;
            }
            console.log(`Profile ${profileName} deleted`);
            });
        });
    }

    async ifSaveProfile(value) {
        let userPick = new enquirer.Select({
            message: "Do you want to save this search as a profile? \n",
            choices: ['YES', 'NO']
        });
        const doWeSave = await userPick.run();
        if(doWeSave === 'YES') {
            await enquirer.prompt({
                type: "input",
                name: "profileName",
                message: "Type a profile name: \n",
                validate: (answer) => {
                    if(answer.trim().length < 1 || answer.includes('\'') || answer.includes('\"')) {
                        return "Please enter a valid name: \n"
                    } else {
                        return true
                    }
                }
            }).then((input) => {
                this.addProfile(input.profileName.trim(), value);
            });
        }
    }
}