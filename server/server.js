import express, { response } from "express";
import { auth } from "express-openid-connect";
import dotevn from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./db/connect.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import User from "./models/UserModel.js";

dotevn.config();

const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  routes: {
    postLogoutRedirect: process.env.CLIENT_URL,
  },
};

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(auth(config));

//function to check if user exists in the database
const ensureUserInDB = asyncHandler(async (user) => {
  try {
    const existingUser = await User.findOne({ auth0Id: user.sub });

    if (!existingUser) {
      //create new user
      const newUser = new User({
        auth0Id: user.sub,
        email: user.email,
        name: user.name,
        role: "jobseeker",
        profilePicture: user.picture,
      });

      await newUser.save();

      console.log("New user added to the database", user);
    } else {
      console.log("User already exists in the database", existingUser);
    }
  } catch (error) {
    console.log("Error checking or adding user to the database", error.message);
  }
});

app.get("/", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    await ensureUserInDB(req.oidc.user);
    return res.redirect(process.env.CLIENT_URL);
  } else {
    return res.send("Logged out");
  }
});

//routes
const routeFiles = fs.readdirSync("./routes");

routeFiles.forEach((file) => {
  //import dynamic routes
  import(`./routes/${file}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
    .catch((error) => {
      console.log("Error importing route", error.message);
    });
});

const server = async () => {
  try {
    await connect();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Server error", error.message);
    process.exit(1);
  }
};

server();
