const mysql = require("mysql2");
const { faker } = require("@faker-js/faker");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "ssb",
  password: "2103",
});

const getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

let data = [];
for (let i = 1; i <= 1000; i++) {
  data.push(getRandomUser());
}

const insertQuery = "INSERT INTO user (id,username,email,password) VALUES ?";

try {
  con.query(insertQuery, [data], (err, result) => {
    if (err) throw err;
    console.log(`Data inserted`);
  });
} catch (err) {
  console.log(err);
}

con.end();
