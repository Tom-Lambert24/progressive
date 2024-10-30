import passport, { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { getUserById, getUserByUsername } from "../databaseFunctions";

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      password_hash: string;
    }
  }
}

type DoneFunction = (error: any, user?: Express.User | false, options?: { message: string }) => void;

async function initialize(
  passport: PassportStatic,
  getUserByUsername: (username: string) => Promise<Express.User | null>,
  getUserById: (id: string) => Promise<Express.User | null>
) {
  const authenticateUser = async (username: string, password: string, done: DoneFunction) => {
    const user = await getUserByUsername(username);

    if (!user) {
      return done(null, false, { message: "No user with that username." });
    }

    try {
      if (await bcrypt.compare(password, user.password_hash)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect." });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "username" }, authenticateUser));

  passport.serializeUser((user: Express.User, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    const user = await getUserById(id);
    return done(null, user || null);
  });
}

export { initialize };
