const mongoose = require("mongoose");
const { Schema } = require("mongoose");

main()
  .then(() => {
    console.log("DB Connect");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/relation");
}

const orderSchema = new Schema({
  item: String,
  price: Number,
});

const customerSchema = new Schema({
  name: String,
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
});

// customerSchema.pre("findOneAndDelete", async () => {
//   console.log("Pre Middleware");
// });

customerSchema.post("findOneAndDelete", async (customer) => {
  if (customer.orders.length) {
    let res = await Order.deleteMany({ _id: { $in: customer.orders } });
    console.log(res);
  }
});

const Order = mongoose.model("Order", orderSchema);
const Customer = mongoose.model("Customer", customerSchema);

const findCustomer = async () => {
  let result = await Customer.find({}).populate("orders");
  console.log(result);
};

// findCustomer();

const addCust = async () => {
  let newCust = new Customer({
    name: "SSB",
  });

  let newOrd = new Order({
    item: "Lassi",
    price: 40,
  });

  newCust.orders.push(newOrd);

  await newOrd.save();
  await newCust.save();

  console.log("Added new cust");
};

// addCust();

const delCust = async (id) => {
  let data = await Customer.findByIdAndDelete(id);
  // console.log(data);
};

delCust("691da98344544fb651abccfa");
