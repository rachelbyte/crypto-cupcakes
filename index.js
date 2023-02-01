require("dotenv").config(".env");
const cors = require("cors");
const express = require("express");
const app = express();
const morgan = require("morgan");
const { PORT = 3000 } = process.env;
const { auth, requiresAuth } = require("express-openid-connect");
// TODO - require express-openid-connect and destructure auth from it

const { SECRET, BASE_URL, CLIENT_ID, ISSUER_BASE_URL } = process.env;

const { User, Cupcake } = require("./db");

const { config } = require("dotenv");

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth(config));

/* *********** YOUR CODE HERE *********** */
// follow the module instructions: destructure config environment variables from process.env
// follow the docs:
// define the config object
// attach Auth0 OIDC auth router
// create a GET / route handler that sends back Logged in or Logged out
app.get("/", (req, res, next) => {
  try {
    res.send(req.oidc.isAuthenticated() ? "Logged In" : "Logged Out");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.get("/profile", requiresAuth(), (req, res, next) => {
  try {
    res.send(req.oidc.user);
    console.log(req.oidc.user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.get("/cupcakes", async (req, res, next) => {
  try {
    const cupcakes = await Cupcake.findAll();
    res.send(cupcakes);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// error handling middleware
app.use((error, req, res, next) => {
  console.error("SERVER ERROR: ", error);
  if (res.statusCode < 400) res.status(500);
  res.send({ error: error.message, name: error.name, message: error.message });
});

app.listen(PORT, () => {
  console.log(`Cupcakes are ready at http://localhost:${PORT}`);
});
