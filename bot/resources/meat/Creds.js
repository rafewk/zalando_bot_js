import enquirer from 'enquirer';

export default class Creds {
    ifLogin;
    login;
    email;
    password;

    async doWeLogIn() {
        let userPick = new enquirer.Select({
            message: "Do you want Bot to log-in for you? \n",
            choices: ['YES', 'NO']
        });
        this.ifLogin = await userPick.run();
    }

    async setLogin() {
        await enquirer.prompt({
            type: "input",
            name: "login",
            message: "Enter login: \n",
        }).then(($input) => {
            this.login = $input.login;
        });
    }

    async setEmail() {
        await enquirer.prompt({
            type: "input",
            name: "email",
            message: "Enter email: \n",
        }).then(($input) => {
            this.email = $input.email;
        });
    }

    async setPassword() {
        await enquirer.prompt({
            type: "password",
            name: "password",
            message: "Enter password: \n",
            mask: "*"
        }).then(($input) => {
            this.password = $input.password;
        });
    }

    clearConsole(millisBeforeClear) {
        setTimeout(function() {
            console.clear();
        }, millisBeforeClear);
    }
}