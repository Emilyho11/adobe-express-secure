import express from 'express';

export const app = express();

// import strategy from './access_control';
import Auth0Strategy from 'passport-auth0';
// import { app } from ".";
import passport from 'passport';

const strategy = new Auth0Strategy(
  {
    state: true,
    clientID: 'YOUR_CLIENT',
    clientSecret: 'YOUR SECRET',
    domain: 'YOUR_DOMAIN',
    callbackURL: 'http://localhost:3000/callback'
  },
   (accessToken, refreshToken, extraParams, profile, done) => {
  console.log('accessToken', accessToken);
  console.log('refreshToken', refreshToken);
  console.log('extraParams', extraParams);
  console.log('profile', profile);
  done(null, profile);
});

// const strategy = new Auth0Strategy({
//      // ...
//      state: false
//   },
//   function(accessToken, refreshToken, extraParams, profile, done) {
//     // ...
//   }
// );

app.get(
  '/login',
  passport.authenticate('auth0', {scope: 'openid email profile'}), 
  function (req, res) {
    console.log("FUCK");
      res.redirect('/');
  }
);


passport.use(strategy);

app.get('/', (req, res) => {

});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

