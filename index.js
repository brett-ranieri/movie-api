const express = require("express"),
    morgan = require('morgan');

const app = express();

let topMovies = [
    {
        title: 'The Mighty Ducks',
        producer: 'Walt Disney Pictures'
    },
    {
        title: 'The Mighty Ducks 2',
        producer: 'Walt Disney Pictures'
    },
    {
        title: 'The Mighty Ducks 3',
        producer: 'Walt Disney Pictures'
    },
    {
        title: 'Ghostbusters',
        producer: 'Columbia Pictures'
    },
    {
        title: 'Ghostbusters 2',
        producer: 'Columbia Pictures'
    },
    {
        title: 'Pirates of the Caribbean: The Curse of the Black Pearl',
        producer: 'Walt Disney Pictures'
    },
    {
        title: 'Pirates of the Caribbean: Dead Man\'s Chest',
        producer: 'Walt Disney Pictures'
    },
    {
        title: 'Teenage Mutant Ninja Turtles',
        producer: 'New Line Home Entertainment'
    },
    {
        title: 'Sin City',
        producer: 'Troublemaker Studios'
    },
    {
        title: 'Home Alone',
        producer: 'Hughes Entertainment'
    },
]
// Logging
app.use(morgan('common'));

//JSON Parsing
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

//Static Files
app.use(express.static('public'));

// GET requests - Routing
app.get('/', (req, res) => {
    let responseText = 'Welcome to my Movie Database! It\'s a work in progress, so keep checking back for more updates.';
    res.send(responseText);
})

//Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken! :(');
})

// set port for which to listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});