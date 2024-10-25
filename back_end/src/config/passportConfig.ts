import passport, { PassportStatic } from "passport";
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      password_hash: string;
    }
  }
}

type User = {
  id: string;
  username: string;
  password_hash: string;
};

async function initialize(
  passport: PassportStatic,
  getUserByUsername: (username: string) => Promise<User | null>,
  getUserById: (id: string) => Promise<User | null>
) {
  const authenticateUser = async (
    username: string,
    password: string,
    done: (err: any, user?: any, info?: { message?: string }) => void
  ) => {
    const user = await getUserByUsername(username);

    if (!user) {
      return done(null, false, { message: "No user with that username." });
    }

    try {
      console.log("User password from DB:", user.password_hash);
      console.log("Password to compare:", password);
      if (await bcrypt.compare(password, user.password_hash)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect." });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "username" }, authenticateUser)
  );

  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    const user = await getUserById(id);
    done(null, user || null);
  });
}

export { initialize };
