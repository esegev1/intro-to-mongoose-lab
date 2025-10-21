const Customer = require('./models/customers.js');
const prompt = require('prompt-sync')();

const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');


/*****************************************
 *         CONNECTION TO MONGODB
 *****************************************/
const connect = async (userAction) => {
    //connect to MongoDB using hte MONGODB_URI 
    await mongoose.connect(process.env.MONGODB_URI);
    // console.log(`Connected to MongoDB`);

    await runQueries(userAction);

    // //disconnect the app from MongoDB after queries complete
    // await mongoose.disconnect();
    // console.log('Disconnected from MongoDB');

    // //close the app
    // process.exit();
};

const runQueries = async (userAction) => {
    // console.log(`Queries running. userAction: ${userAction}`);

    switch (userAction) {
        case '1':
            await createCustomer();
            break;
        case '2':
            await viewAllCustomers();
            break;
        case '3':
            await updateCustomers();
            break;
        case '4':
            await deleteCustomers();
            break;
        case '5':
            await exit();
            break;
    }
};

/*****************************************
 *           QUERY DEFINITIONS
 *****************************************/
const createCustomer = async () => {


    //prompt user for new customer info
    const customerName = prompt(`What is the Customer's name? `);
    const customerAge = prompt(`What is the Customer's age? `);

    //prepare obj with document info
    const customerData = {
        name: customerName,
        age: customerAge,
    }

    // console.log(`customerData ${JSON.stringify(customerData)}`);
    console.log(``);
    console.log(`Creating customer...`);
    //
    const customer = await Customer.create(customerData);
    // console.log(`New customer: ${customer}`)

    entryPoint();
};

const viewAllCustomers = async () => {
    console.log(`See all customers below:`);
    console.log(``);
    const customers = await Customer.find({});

    customers.forEach((customer) => {
        console.log(`id: ${customer.id} -- Name: ${customer.name}, Age: ${customer.age}`);

    });

    entryPoint();

}

const updateCustomers = async () => {
    //prompt user for the cusotmer id and desired updates
    const id = prompt(`What is the Customer's Id? `);

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(`Error: Invalid customer ID format`);
        entryPoint();
        return;
    }

    console.log(``);
    const fields = prompt(`Enter the fields you want to update, comma seperated? `);
    const values = prompt(`Enter the corrosponding values, comma seperated? `);
    console.log(``);

    // console.log(`id: ${id}`);

    const fieldsArr = fields.split(',').map(field => field.trim());
    const valuesArr = values.split(',').map(value => value.trim());


    //create an object with fields the user wants to update
    const updateObj = {};

    // updateObj[field] = value;

    for (let x = 0; x < fieldsArr.length; x++) {
        updateObj[fieldsArr[x]] = valuesArr[x];
    }

    // console.log(`updateObj: ${JSON.stringify(updateObj)}`);


    const updateCustomer = await Customer.findByIdAndUpdate(
        id,
        updateObj,
        { new: true }
    );

    if (updateCustomer) {
        console.log(`Update successful!`)
    } else {
        console.log(`That did not seem to work, try again.`);
    }

    entryPoint();
};

const deleteCustomers = async () => {
    //prompt user for the cusotmer id and desired updates
    const id = prompt(`What is the Customer's Id? `);
    const removeCustomer = await Customer.findByIdAndDelete(id);
    console.log(``);
    console.log(`Removed customer id: ${id}`);

    entryPoint();

}

const exit = async () => {
    //disconnect the app from MongoDB after queries complete
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    console.log(`Goddbye!`)

    //close the app
    process.exit();
}

/*****************************************
 *            USER INTERFACE
 *****************************************/
function entryPoint() {


    console.log(``);
    console.log(`You can do the following:`);
    console.log(`   1. Create customer`);
    console.log(`   2. View all customers`);
    console.log(`   3. Update customer`);
    console.log(`   4. Delete customer`);
    console.log(`   5. Quit`);
    console.log(``);

    const userAction = prompt('Enter the number here? ');
    console.log(``);

    connect(userAction);

}

console.log(``);
console.log(`Welcome to the CRM-izer 5000`);

entryPoint();