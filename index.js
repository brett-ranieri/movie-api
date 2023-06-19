const express = require("express"),
	bodyParser = require("body-parser"),
	uuid = require("uuid"),
	morgan = require("morgan"),
	mongoose = require("mongoose");
//require models.js file
const Models = require("./models.js");
const { check, validationResult } = require("express-validator");
//below refers to mongoose models defined in models.js file
const Movies = Models.Movie;
const Users = Models.User;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //both lines here import body-parser and makes sure middleware is being used. MUST be before any other endpoint middleware.
///////// CROSS-ORIGIN RESOURCE SHARING /////////
//must be before auth and any route middleware
const cors = require("cors");
// app.use(cors());
//Below can be used to restrict access to only certain origins, commented out because prompt requests access for ALL origins.

let allowedOrigins = [
	"http://localhost:8080",
	"http://testsite.com",
	"http://localhost:1234",
	"https://mymovieapp-brettranieri.netlify.app",
	"http://localhost:4200",
	"https://brett-ranieri.github.io/myMovie-Angular-client/",
]; //varaiable that lists all Origins that will be given permissions

app.use(
	cors({
		//compares domains of incoming requests with allowed Origin list and either allows or returns an error.
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				//if a specific origin is not found in allowed origin list
				let message =
					"The CORS policy for this application doesn't allow access from origin " + origin;
				return callback(new Error(message), false);
			}
			return callback(null, true);
		},
	})
);

let auth = require("./auth")(app); //must be AFTER bodyParser

const passport = require("passport"); //must be AFTER auth
require("./passport");
//Connect to Local Database
// mongoose.connect('mongodb://localhost:27017/myMovieDB', {useNewUrlParser: true, useUnifiedTopology: true});
//Connect to Online Database
mongoose.connect(process.env.connection_uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
// Logging
app.use(morgan("common"));
// GET requests - Initial Routing
app.get("/", (req, res) => {
	let responseText =
		"Welcome to my Movie Database! It's a work in progress, so keep checking back for more updates.";
	res.send(responseText);
});
//CREATE - Add New User
app.post(
	"/users",
	[
		check("Username", "Username must be at least 5 characters long").isLength({
			min: 5,
		}),
		check(
			"Username",
			"Username contains non alphanumeric characters - not allowed"
		).isAlphanumeric(),
		check("Password", "Password is required").not().isEmpty(),
		check("Email", "Email does not appear to be valid").isEmail(),
	],
	(req, res) => {
		let errors = validationResult(req); //check validation object for errors

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		let hashedPassword = Users.hashPassword(req.body.Password);
		Users.findOne({ Username: req.body.Username })
			.then((user) => {
				if (user) {
					return res.status(400).send(req.body.Username + " already exists");
				} else {
					Users.create({
						Name: req.body.Name,
						Username: req.body.Username,
						Password: hashedPassword,
						Email: req.body.Email,
						Birthday: req.body.Birthday,
					})
						.then((user) => {
							res.status(201).json(user);
						})
						.catch((error) => {
							console.error(error);
							res.status(500).send("Error: " + error);
						});
				}
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send("Error: " + error);
			});
	}
);
//UPDATE - Allow User to update info by username
/////////// CURRENT PERMISSIONS - SEEMS USERS CAN UPDATE INFO OF ANY USER??? //////////
app.put(
	"/users/:Username",
	[
		check("Username", "Username must be at least 5 characters long")
			.isLength({ min: 5 })
			.optional(),
		check("Username", "Username contains non alphanumeric characters - not allowed")
			.isAlphanumeric()
			.optional(),
		check("Email", "Email does not appear to be valid").isEmail().optional(), //optional is necessary to prevent validation from checking empty field
		passport.authenticate("jwt", { session: false }),
	],
	(req, res) => {
		let errors = validationResult(req); //check validation object for errors
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let hashedPassword;
		if (req.body.Password) {
			hashedPassword = Users.hashPassword(req.body.Password);
		}

		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$set: {
					Name: req.body.Name,
					Username: req.body.Username,
					Password: hashedPassword,
					Email: req.body.Email,
					Birthday: req.body.Birthday,
				},
			},
			{ new: true }, //this line makes sure that updated document is returned
			(err, updatedUser) => {
				if (err) {
					console.error(err);
					res.status(500).send("Error: " + err);
				} else {
					res.json(updatedUser);
				}
			}
		);
	}
);
//UPDATE - Allow User to add a movie to favorites list
app.put(
	"/users/:Username/movies/:_id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$addToSet: { FavoriteMovies: req.params._id },
			},
			{ new: true }, //this line makes sure that the updated document is returned
			(err, updatedUser) => {
				if (err) {
					console.error(err);
					res.status(500).send("Error: " + err);
				} else {
					res.status(201).json(updatedUser);
					console.log(req.params._id);
				}
			}
		);
	}
);
//DELETE - Allow User to remove a movie from favorites list
app.delete(
	"/users/:Username/remove/:MovieID",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$pull: { FavoriteMovies: req.params.MovieID },
			},
			{ new: true },
			(err, updatedUser) => {
				if (err) {
					console.error(err);
					res.status(500).send("Error: " + err);
				} else {
					res.status(200).json(updatedUser);
				}
			}
		);
	}
);
//DELETE - Allow User to remove their account
app.delete("/users/:Username", passport.authenticate("jwt", { session: false }), (req, res) => {
	Users.findOneAndRemove({ Username: req.params.Username })
		.then((user) => {
			if (!user) {
				res.status(400).send(req.params.Username + " was not found and could not be deleted.");
			} else {
				res
					.status(200)
					.json(
						"The account belonging to " + req.params.Username + " has been succesfully deleted."
					);
				console.log("the res ", res.ok);
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error: " + error);
		});
});
// READ - Return list of all Users
//////////////////// NEED TO UPDATE TO ONLY RETURN PUBLIC DATA...NOT PASSWORDS /////////////////////////
app.get("/users", passport.authenticate("jwt", { session: false }), (req, res) => {
	Users.find()
		.then((users) => {
			res.status(201).json(users);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error: " + error);
		});
});
// READ - Get a user by username
app.get("/users/:Username", passport.authenticate("jwt", { session: false }), (req, res) => {
	Users.findOne({ Username: req.params.Username })
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error: " + error);
		});
});
// READ - Get a user by userId
app.get("/users/:_id", passport.authenticate("jwt", { session: false }), (req, res) => {
	console.log("from API", req.params._id);
	Users.findOne({ _id: req.params._id })
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error: " + error);
		});
});
// READ - Return list of all movies to user
app.get("/movies", passport.authenticate("jwt", { session: false }), (req, res) => {
	Movies.find()
		.then((movies) => {
			res.status(201).json(movies);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error: " + error);
		});
});
// READ - Return data about a single movie
app.get("/movies/:Title", passport.authenticate("jwt", { session: false }), (req, res) => {
	Movies.findOne({ Title: req.params.Title })
		.then((movie) => {
			res.status(200).json(movie);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error: " + error);
		});
});
// READ - Return description about Genre from Genre name
app.get(
	"/movies/genre/:genreName",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Movies.findOne({ "Genre.Name": req.params.genreName })
			.then((movie) => {
				res.status(200).json(movie.Genre);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send("Error: " + error);
			});
	}
);
// READ - Return data about Director by name
app.get(
	"/movies/directors/:directorName",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Movies.findOne({ "Director.Name": req.params.directorName })
			.then((movie) => {
				res.status(200).json(movie.Director);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send("Error: " + error);
			});
	}
);
// READ - Return data about a movie with specific Genre AND a specific director
app.get(
	"/movies/genres/:genreName/directors/:directorName",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Movies.findOne({
			"Genre.Name": req.params.genreName,
			"Director.Name": req.params.directorName,
		})
			.then((movie) => {
				if (!movie) {
					res
						.status(400)
						.send(
							"No movie found with " + req.params.genreName + " and " + req.params.directorName
						);
				} else {
					res.status(200).json(movie);
				}
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send("Error: " + error);
			});
	}
);
//Static Files
app.use(express.static("public"));

app.use(express.json());
//Error Handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something is broken! :(");
});
// set port for which to listen for requests
const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
//Export so it can be read by Vercel
module.exports = app;
