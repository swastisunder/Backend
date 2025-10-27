const express = require("express");
const path = require("path");
const sql = require("mysql2");
const port = 8080;
const app = express();
const methodOverride = require("method-override");
const { faker } = require("@faker-js/faker");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

const con = sql.createConnection({
  host: "localhost",
  user: "root",
  database: "ssb",
  password: "2103",
});

// --- Validation helpers ---
function isValidEmail(email) {
  // simple RFC-like check
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(pw) {
  return typeof pw === "string" && pw.length >= 6; // minimal strength rule
}

function sanitizeString(s) {
  return typeof s === "string" ? s.trim() : "";
}

app.get("/", (req, res) => {
  let selectQuery = "SELECT COUNT(*) FROM user";
  try {
    con.query(selectQuery, (err, result) => {
      if (err) throw err;
      let totalUser = result[0]["COUNT(*)"];
      res.render("home.ejs", { totalUser });
    });
  } catch (error) {
    console.error(error);
    res.render("error.ejs", { errorMessage: error.message || String(error) });
  }
});

app.get("/users", (req, res) => {
  let selectAllQuery = "SELECT * FROM user";
  try {
    con.query(selectAllQuery, (err, result) => {
      if (err) throw err;
      let users = result;
      res.render("users.ejs", { users });
    });
  } catch (err) {
    console.error(err);
    res.render("error.ejs", { errorMessage: err.message || String(err) });
  }
});

app.get("/users/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/users", (req, res) => {
  const id = faker.string.uuid();
  let { username, email, password } = req.body;

  // sanitize
  username = sanitizeString(username);
  email = sanitizeString(email);
  password = typeof password === "string" ? password : "";

  // basic validations
  if (!username || !email || !password) {
    return res.render("error.ejs", { errorMessage: "All fields are required." });
  }
  if (username.length < 3 || username.length > 30) {
    return res.render("error.ejs", { errorMessage: "Username must be 3-30 characters." });
  }
  if (!isValidEmail(email)) {
    return res.render("error.ejs", { errorMessage: "Please provide a valid email address." });
  }
  if (!isStrongPassword(password)) {
    return res.render("error.ejs", { errorMessage: "Password must be at least 6 characters." });
  }

  // check uniqueness for username/email
  const checkQuery = "SELECT id, username, email FROM user WHERE username = ? OR email = ?";
  con.query(checkQuery, [username, email], (err, rows) => {
    if (err) {
      console.error(err);
      return res.render("error.ejs", { errorMessage: err.message || String(err) });
    }

    if (rows.length) {
      const existingUser = rows[0];
      if (existingUser.username === username) {
        return res.render("error.ejs", { errorMessage: "Username already exists. Choose another." });
      }
      if (existingUser.email === email) {
        return res.render("error.ejs", { errorMessage: "Email already registered. Use another email." });
      }
    }

    const addUserQuery = "INSERT INTO user (id,username,email,password) VALUES (?,?,?,?)";
    con.query(addUserQuery, [id, username, email, password], (err, result) => {
      if (err) {
        console.error(err);
        return res.render("error.ejs", { errorMessage: err.message || String(err) });
      }
      res.redirect("/users");
    });
  });
});

app.get("/user/:id/edit", (req, res) => {
  let findUserQuery = `SELECT * FROM user WHERE id = ?`;
  let { id } = req.params;

  try {
    con.query(findUserQuery, id, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.error(err);
    res.render("error.ejs", { errorMessage: err.message || String(err) });
  }
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const deleteQuery = "DELETE FROM user WHERE id = ?";

  try {
    con.query(deleteQuery, [id], (err, result) => {
      if (err) throw err;
      res.redirect("/users");
    });
  } catch (err) {
    res.send(err);
  }
});

app.patch("/users/:id", (req, res) => {
  const { id } = req.params;
  let { username, password } = req.body;
  username = sanitizeString(username);
  password = typeof password === "string" ? password : "";

  if (!username) {
    return res.render("error.ejs", { errorMessage: "Username cannot be empty." });
  }
  if (username.length < 3 || username.length > 30) {
    return res.render("error.ejs", { errorMessage: "Username must be 3-30 characters." });
  }
  if (!password) {
    return res.render("error.ejs", { errorMessage: "Password is required to update username." });
  }

  // 1. Get current user (username + password)
  const getUserQuery = "SELECT username, password FROM user WHERE id = ?";
  con.query(getUserQuery, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.render("error.ejs", { errorMessage: err.message || String(err) });
    }
    if (!results.length) {
      return res.render("error.ejs", { errorMessage: "User not found" });
    }

    const current = results[0];

    if (current.password !== password) {
      return res.render("error.ejs", {
        errorMessage: "Wrong password for this user",
      });
    }

    // If username unchanged, short-circuit
    if (current.username === username) {
      return res.render("success.ejs", { successMessage: "No changes made. Username unchanged." });
    }

    // 3. Check if username exists for a different user
    const findUserQuery = "SELECT id FROM user WHERE username = ?";
    con.query(findUserQuery, [username], (err, found) => {
      if (err) {
        console.error(err);
        return res.render("error.ejs", { errorMessage: err.message || String(err) });
      }
      if (found.length && found.some((r) => r.id !== id)) {
        return res.render("error.ejs", {
          errorMessage: "Username already exists. Choose another!",
        });
      }

      // 4. Update username
      const updateQuery = "UPDATE user SET username = ? WHERE id = ?";
      con.query(updateQuery, [username, id], (err) => {
        if (err) {
          console.error(err);
          return res.render("error.ejs", { errorMessage: err.message || String(err) });
        }
        res.render("success.ejs", {
          successMessage: "Username updated successfully!",
        });
      });
    });
  });
});

// con.end();

app.listen(port, () => {
  console.log(`Server is running`);
});
