const mongoose = require('mongoose');

// 1. Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/relation')
    .then(() => console.log("Connection Open!"))
    .catch(err => console.log(err));

// 2. Define the Schemas
// Order Schema
const orderSchema = new mongoose.Schema({
    item: String,
    price: Number
});

// Customer Schema
const customerSchema = new mongoose.Schema({
    name: String,
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order' // This links to the Order model
        }
    ]
});

// 3. Create Models
const Order = mongoose.model('Order', orderSchema);
const Customer = mongoose.model('Customer', customerSchema);

// 4. Function to Seed Data
const seedDB = async () => {
    try {
        // Clear existing data to avoid duplicates if you run this twice
        await Order.deleteMany({});
        await Customer.deleteMany({});

        // Create the Orders found in the image
        // Note: In your image, Somasa (ID ending in cd) is NOT in Rahul's order list.
        const order1 = new Order({ item: 'Somasa', price: 12 });
        const order2 = new Order({ item: 'Chips', price: 10 });
        const order3 = new Order({ item: 'Chocolate', price: 40 });

        // Save Orders to generate their _id
        await order1.save();
        await order2.save();
        await order3.save();

        // Create the Customer (Rahul Kumar)
        const customer1 = new Customer({
            name: 'Rahul Kumar'
        });

        // Push specifically Chips and Chocolate into Rahul's orders
        // (Matching the IDs ending in ...ce and ...cf from your image)
        customer1.orders.push(order2);
        customer1.orders.push(order3);

        // Save the Customer
        await customer1.save();

        console.log("Database seeded!");
        console.log("--- Customer Data ---");
        console.log(customer1);
        console.log("--- All Orders ---");
        console.log(await Order.find({}));

    } catch (e) {
        console.log(e);
    } finally {
        // Close connection
        mongoose.connection.close();
    }
}

// Run the seed function
seedDB();