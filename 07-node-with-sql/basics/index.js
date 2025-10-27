const mysql = require("mysql2");
const { faker } = require("@faker-js/faker");

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "ssb",
  password: "2103",
});

let data = [];
for (let i = 1; i <= 10; i++) {
  data.push(getRandomUser());
}

const query = "INSERT INTO user (id,username,email,password) VALUES ?";

try {
  con.query(query, [data], (err, result) => {
    if (err) {
      throw err;
    }
    console.log(`${data.length} Data Inserted ${result}`);
  });
} catch (err) {
  console.log(err);
}

con.end();
