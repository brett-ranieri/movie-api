const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan'),
    mongoose = require('mongoose');
//all above are requirements
const Models = require('./models.js'); //requires models.js file
const { check, validationResult } = require('express-validatior');
//below refers to mongoose models defined in models.js file
const Movies = Models.Movie; 
const Users = Models.User;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//both lines here import body-parser and makes sure middleware is being used. MUST be before any other endpoint middleware.

////////// CROSS-ORIGIN RESOURCE SHARING ////////////////////////
const cors = require('cors');
app.use(cors());//must be before auth and any route middleware

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com']; //varaiable that lists all Origins that will be given permissions

app.use(cors({ //compares domains of incoming requests with allowed Origin list and either allows or returns an error.
    origin: (origin, callback) => {
        if(!origin) return callback (null, true);
        if(allowedOrigins.indexOf(origin) === -1){ //if a specific origin is not found in allowed origin list
            let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
            return callback(new Error(message ), false);
        }
        return callback(null, true);
    }
}));

let auth = require('./auth')(app);//must be AFTER bodyParser

const passport = require('passport');//must be AFTER auth
require('./passport');

mongoose.connect('mongodb://localhost:27017/myMovieDB', {useNewUrlParser: true, useUnifiedTopology: true}); //allows mongoose to connect to database

// Logging
app.use(morgan('common'));

//CREATE - Add New User
app.post('/users', 
    [check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
    let errors = validationResult(req); //check validation object for errors

    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()});
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Name: req.body.Name,
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => {res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//UPDATE - Allow User to update info by username
/////////////////////////////// CURRENT PERMISSIONS - USERS CAN UPDATE INFO OF ANY USER //////////////////////////
// Need to add If comparing username of param to username of token?
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
            {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
    },
    { new: true }, //this line makes sure that updated document is returned
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//UPDATE - Allow User to add a movie to favorites list
app.put('/users/:Username/movies/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $addToSet: { FavoriteMovies: req.params._id }
    },
    { new: true }, //this line makes sure that the updated document is returned
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.status(201).json(updatedUser);
            console.log(req.params._id);
        }
    });
});

//DELETE - Allow User to remove a movie from favorites list
app.delete('/users/:Username/remove/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.status(200).json(updatedUser);
        }
    });
});

//DELETE - Allow User to remove their account
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if(!user) {
                res.status(400).send(req.params.Username + ' was not found and could not be deleted.');
            } else {
                res.status(200).send('The account belonging to ' + req.params.Username + ' has been succesfully deleted.');
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// READ - Return list of all Users 
//////////////////// NEED TO UPDATE TO ONLY RETURN PUBLIC DATA...NOT PASSWORDS /////////////////////////
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// READ - Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// READ - Return list of all movies to user
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});
// READ - Return data about a single movie
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.status(200).json(movie);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});
// READ - Return description about Genre from Genre name
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genreName })
        .then((movie) => {
            res.status(200).json(movie.Genre);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});
// READ - Return data about Director by name
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.directorName })
        .then((movie) => {
            res.status(200).json(movie.Director);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});
// READ - Return data about a movie with specific Genre AND a specific director
app.get('/movies/genres/:genreName/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genreName, 'Director.Name': req.params.directorName })
        .then((movie) => {
            if(!movie) {
                res.status(400).send('No movie found with ' + req.params.genreName + ' and ' + req.params.directorName);
            } else {
                res.status(200).json(movie);
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});
//Static Files
app.use(express.static('public'));

// GET requests - Routing
app.get('/', (req, res) => {
    let responseText = "Welcome to my Movie Database! It's a work in progress, so keep checking back for more updates.";
    res.send(responseText);
})

//Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something is broken! :(");
})

// set port for which to listen for requests
app.listen(8080, () => {
    console.log("Your app is listening on port 8080.");
});