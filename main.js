import inquirer from "inquirer";
let customers = [];
function delay() {
    new Promise((r) => setTimeout(r, 2000));
}
class Customer {
    constructor(name, age, contactNumber, userId, pin) {
        this.name = name;
        this.age = age;
        this.contactNumber = contactNumber;
        this.userId = userId;
        this.pin = pin;
        this.bankAccount = new BankAccount();
    }
}
class BankAccount {
    constructor() {
        this.accountNumber = Math.floor(Math.random() * (9 * Math.pow(10, 10))) + Math.pow(10, 10);
        this.transactionHistory = [];
        this.accountBalance = 100;
    }
    Debit(amount) {
        let index = String(new Date()).lastIndexOf(":") + 3;
        let date = String(new Date()).slice(0, index);
        this.accountBalance -= amount;
        this.transactionHistory.push({
            type: 'Debit',
            amount: amount,
            date: date,
            fee: 0,
        });
    }
    Credit(amount) {
        let index = String(new Date()).lastIndexOf(":") + 3;
        let date = String(new Date()).slice(0, index);
        if (amount > 100) {
            this.accountBalance += amount - 1;
            this.transactionHistory.push({
                type: "Credit",
                amount: amount,
                date: date,
                fee: 1,
            });
        }
        else {
            this.accountBalance += amount;
            this.transactionHistory.push({
                type: "Credit",
                amount: amount,
                date: date,
                fee: 0,
            });
        }
    }
}
function customerInfo(customer) {
    console.log("--------------------------------------");
    console.log(`Name            : ${customer.name}`);
    console.log(`Age             : ${customer.age}`);
    console.log(`Contact Number  : ${customer.contactNumber}`);
    console.log(`UserID          : ${customer.userId}`);
    console.log(`Account Balance : RS: ${customer.bankAccount.accountBalance}`);
    console.log(`Account Number  : ${customer.bankAccount.accountNumber}`);
    console.log("--------------------------------------");
}
function showAccountBalance(customer) {
    console.log("--------------------------------------");
    console.log(`Account Balance : RS: ${customer.bankAccount.accountBalance}`);
    console.log("--------------------------------------");
}
async function Credit(customer) {
    while (true) {
        const { inputAmount } = await inquirer.prompt([
            {
                name: "amount",
                message: "Enter Amount : ",
                type: "number",
            },
        ]);
        delay();
        customer.bankAccount.Credit(inputAmount);
        if (inputAmount > 0 || inputAmount < 1000) {
            console.log("Transaction Successful");
        }
        else {
            console.log("Transaction Successful And RS:1 Minus");
        }
        return;
    }
}
async function Debit(customer) {
    while (true) {
        const { inputAmount } = await inquirer.prompt([
            {
                name: "amount",
                message: "Enter Amount : ",
                type: "number",
            },
        ]);
        delay();
        if (!inputAmount) {
            console.error(" Enter Correct Amount");
            continue;
        }
        if (inputAmount > customer.bankAccount.accountBalance) {
            console.error(" Amount is Greater than Your Balance");
            return;
        }
        customer.bankAccount.Debit(inputAmount);
        console.log("Transaction Successful");
        return;
    }
}
function transactionHistory(customer) {
    if (!customer.bankAccount.transactionHistory.length) {
        console.log(" No Transaction Available");
        return;
    }
    console.table(customer.bankAccount.transactionHistory.map((val) => {
        return { ...val, fee: `RS: ${val.fee}`, amount: `RS: ${val.amount}` };
    }));
}
let accountOptions = await inquirer.prompt({
    name: 'options',
    type: 'list',
    message: 'Select:',
    choices: ['1. Create New Account', '2. Sign In']
});
async function createNewAccount() {
    var input = await inquirer.prompt([
        {
            name: "name",
            message: `Enter Your Name: `,
            type: 'input',
        },
        {
            name: "age",
            message: `Enter Your age: `,
            type: 'number',
        },
        {
            name: "contactNumber",
            message: `Enter Your Contact No: `,
            type: 'number',
        },
        {
            name: "pin",
            message: `Enter Pin: `,
            type: 'password',
            mask: '*'
        },
        {
            name: "userId",
            message: `Enter User ID: `,
            type: 'input',
        }
    ]);
    let customer = new Customer(input.name, input.age, input.contactNumber, input.pin, input.userId);
    customers.push(customer);
    console.log(`Account Created Successfully`);
}
async function signIn() {
    const { userID, pin } = await inquirer.prompt([
        {
            name: "userID",
            message: "Enter Your UserID : ",
        },
        {
            name: "pin",
            message: "Enter Your Pin : ",
            type: "password",
            mask: '*',
        },
    ]);
    let customer = customers.find((val) => val.userId === userID);
    if (!customer) {
        console.log(` No Customer With This UserID`);
        return;
    }
    else {
        if (customer.pin !== pin) {
            console.log(` Incorrect PIN`);
            return;
        }
        console.log("Signed In Successfully");
        while (true) {
            const { userChoice } = await inquirer.prompt([
                {
                    name: "userChoice",
                    message: "Make Your Choice",
                    type: "rawlist",
                    choices: [
                        "1. Show Profile",
                        "2. Debit",
                        "3. Credit",
                        "4. Account Balance",
                        "5. Transaction History",
                    ],
                },
            ]);
            if (userChoice.userChoice === "1. Show Profile") {
                customerInfo(customer);
                break;
            }
            if (userChoice.userChoice === "2. Debit") {
                Debit(customer);
                break;
            }
            if (userChoice.userChoice === "3. Credit") {
                Credit(customer);
                break;
            }
            if (userChoice.userChoice === "4. Account Balance") {
                showAccountBalance(customer);
                break;
            }
            if (userChoice.userChoice === "5. Transaction History") {
                transactionHistory(customer);
                break;
            }
            let choice = await inquirer.prompt({
                name: 'choice',
                type: 'list',
                message: 'Select: ',
                choices: ['Perform another Task', 'Sign Out']
            });
            if (choice.choice === 'Sign Out') {
                console.log('You are signed Out.');
                break;
            }
            else {
                continue;
            }
        }
    }
}
async function main() {
    while (true) {
        if (accountOptions.options === '1. Create New Account') {
            await createNewAccount();
        }
        else if (accountOptions.options === '2. Sign In') {
            await signIn();
        }
    }
}
main();
