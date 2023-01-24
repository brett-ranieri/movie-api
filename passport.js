const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;
//Defines basic HTTP Authentication for login requests
passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
}, (username, password, callback) => {
    console.log (username + '  ' + password);
    Users.findOne({ Username: username }, (error, user) => {
        if (error) {
            console.error(error);
            return callback(error);
        }

        if (!user) {
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect Username.'});
        }

        if (!user.validatePassword(password)) {
            console.log('incorrect password');
            return callback(null, false, {message: 'Incorrect Password'});
        }
        
        console.log('finished');
        return callback(null, user);
    });
}));
//Authenticate users based on JWT Authentication code
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), //extracts JWT from Header
    secretOrKey: 'your_jwt_secret' //uses secret Key to verify that user is who it says it is (also that JWT has not been altered)
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback (null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));