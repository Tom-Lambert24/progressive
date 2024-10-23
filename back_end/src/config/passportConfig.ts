import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

passport.use(
  new LocalStrategy((username, password, done) => {
    // In a real-world app, find the user in the database and verify the password
    if (username === 'admin' && password === 'password') {
      return done(null, { username });
    } else {
      return done(null, false, { message: 'Incorrect credentials' });
    }
  })
);

// Serialize user (to save user data in the session)
passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

// Deserialize user (to retrieve user data from the session)
passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});