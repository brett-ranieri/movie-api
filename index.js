const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan');

const app = express();

app.use(bodyParser.json());

let users = [
    {
        id: 166,
        name: 'Allison',
        favoriteMovies: []
    },
    {
        id: 252,
        name: 'Maurice',
        favoriteMovies: []
    },
    {
        id: 333,
        name: 'Biers',
        favoriteMovies: []
    },
    {
        id: 407,
        name: 'Benny',
        favoriteMovies: []
    },
    {
        id: 516,
        name: 'Flo',
        favoriteMovies: []
    },
]

let movies = [
    {
        "Title": "The Mighty Ducks",
        "Description":"After being pulled over for drunk driving, Minneapolis-based attorney Gordon Bombay is sentenced to 500 hours of community service, coaching youth hockey. There he meets the District 5 peewee hockey team perennial losers who finish at the bottom of the league standings year after year. They are shut out every game and lose by at least five goals. The players learn Bombay was once a player for the Hawks and the team in the same league but left hockey because of the embarrassment that followed after a failed attempt at a penalty shot at the end of regulation causing them to lose in overtime costing them a peewee championship. With the help of Coach Bombay and a desperately needed infusion of cash and equipment from Bombay's law firm, the players learn the fundamentals of the sport. Soon enough the District 5 team now christened the Ducks after Bombay's employer Gerald Ducksworth start winning games and manage to make the playoffs, reaching the finals and adding new player Adam Banks, an ex-Hawk who is a talented player and an asset for the Ducks. Bombay faces the Hawks, the team he grew up playing for still led by Jack Reilly, the same coach Bombay played for. Fittingly, the Ducks win the title game on a penalty shot by Bombay's protege Charlie.",
        "Genre": {
            "Name":"Sports",
            "Description":"A movie about sports and atheletic teams"
        },
        "Director": {
            "Name":"Stephen Herek",
            "Bio": "His career as a film director took off in 1986 with the cult horror classic Critters followed by the hit comedy Bill and Ted's Excellent Adventure in 1989.[1] He then directed Don't Tell Mom the Babysitter's Dead in 1991 and became a regular director for The Walt Disney Company throughout the decade, helming The Mighty Ducks in 1992, The Three Musketeers in 1993, the highly successful live-action 1996 remake of 101 Dalmatians starring Glenn Close, and the Eddie Murphy comedy Holy Man in 1998. He also directed the critically acclaimed drama Mr. Holland's Opus in 1995. In the 2000s, Herek directed the 2001 movie Rock Star, a film about a rockstar wannabe and his favorite rock group, Steel Dragon, starring Mark Wahlberg and Jennifer Aniston. After the underwhelming performances of Life or Something Like It in 2002 and Man of the House in 2005, Herek has stayed mainly in the television and direct-to-DVD market, helming films like Picture This, Into the Blue 2: The Reef, and The Chaperone, as well as two Dolly Parton TV specials.",
            "Birth":"1958",
            "Death":"Living"
        },
        "ImageURL":"https://en.wikipedia.org/wiki/The_Mighty_Ducks#/media/File:Disney's_Mighty_Ducks_(franchise_logo).png",
        "Featured":false
    },
    {
        "Title": "Die Hard",
        "Description":"On Christmas Eve, New York City Police Department (NYPD) Detective John McClane arrives in Los Angeles, hoping to reconcile with his estranged wife, Holly, at a party held by her employer, the Nakatomi Corporation. He is driven to Nakatomi Plaza by a limo driver, Argyle, who offers to wait for McClane in the garage. While McClane changes clothes, the tower is seized by German radical Hans Gruber and his heavily armed team, including Karl and Theo. Everyone in the tower is taken hostage except for McClane, who slips away, and Argyle, who remains oblivious to events.",
        "Genre": {
            "Name":"Action",
            "Description":"A movie with intense sequences involving explosions and stuff"
        },
        "Director": {
            "Name":"John McTiernan",
            "Bio": "He is best known for his action films, especially Predator (1987), Die Hard (1988), and The Hunt for Red October (1990). His later well-known films include the action-comedy-fantasy film Last Action Hero (1993), the action film sequel Die Hard with a Vengeance (1995), the heist-film remake The Thomas Crown Affair (1999), and The 13th Warrior (1999). His last completed feature film was the mystery-thriller Basic, released in 2003.",
            "Birth":"1951",
            "Death":"Living"
        },
        "ImageURL":"https://upload.wikimedia.org/wikipedia/en/c/ca/Die_Hard_%281988_film%29_poster.jpg",
        "Featured":false
    },
    {
        "Title": "Home Alone",
        "Description":"The McCallister family is preparing to spend Christmas in Paris, gathering at Kate and Peter's home in a Chicago suburb on the night before their departure. Kate and Peter's youngest son, Kevin, is the subject of ridicule by his older siblings and cousins. Kevin inadvertently ruins the family dinner after a brief scuffle with his oldest brother Buzz, in which Kevin's airplane ticket is accidentally thrown away, resulting in Kate sending him up to the attic. Kevin berates his mother for allowing the rest of the family to pick on him and wishes that his family would disappear. During the night, heavy winds create a power outage, disabling the alarm clocks and causing the family to oversleep. In the confusion and rush to get to the airport, Kevin is accidentally left behind.",
        "Genre": {
            "Name":"Comedy",
            "Description":"A movie that is dedicated to making the audience laugh"
        },
        "Director": {
            "Name":"Chris Columbus",
            "Bio": "Columbus studied film at Tisch School of the Arts where he developed an interest in filmmaking. After writing screenplays for several teen comedies in the mid-1980s, he made his directorial debut with a teen adventure, Adventures in Babysitting (1987). Columbus gained recognition soon after with the highly successful Christmas comedy Home Alone (1990) and its sequel Home Alone 2: Lost in New York (1992).",
            "Birth":"1958",
            "Death":"Living"
        },
        "ImageURL":"https://en.wikipedia.org/wiki/Home_Alone#/media/File:Home_alone_poster.jpg",
        "Featured":false
    },
    {
        "Title": "A Star is Born",
        "Description":"Forty-three-year-old Jackson 'Jack' Maine, a famous country rock singer privately battling an alcohol and drug addiction, plays a concert. His primary support is Bobby, his manager and older half-brother. After a show, Jack goes out for drinks and visits a drag bar where he witnesses a tribute performance to Édith Piaf by thirty-one-year-old Ally, who works as a waitress and singer-songwriter. Jack is amazed by her performance, and they spend the night talking to each other, where Ally discusses her unsuccessful efforts in pursuing a professional music career. Ally shares with Jack some lyrics she has been working on, and he tells her she is a talented songwriter and should perform her material.",
        "Genre": {
            "Name":"Drama",
            "Description":"A movie about emotional topics, meant to elicit a reaction. Typically has sad moments."
        },
        "Director": {
            "Name":"Bradley Cooper",
            "Bio": "He is the recipient of various accolades, including a British Academy Film Award and two Grammy Awards, in addition to nominations for nine Academy Awards, six Golden Globe Awards, and a Tony Award. Cooper appeared on the Forbes Celebrity 100 three times and on Time's list of the 100 most influential people in the world in 2015. His films have grossed $11 billion worldwide and he has placed four times in annual rankings of the world's highest-paid actors.",
            "Birth":"1975",
            "Death":"Living"
        },
        "ImageURL":"https://en.wikipedia.org/wiki/A_Star_Is_Born_(2018_film)#/media/File:A_Star_is_Born.png",
        "Featured":false
    },
    {
        "Title": "The Maltese Falcon",
        "Description":"In San Francisco in 1941, private investigators Sam Spade and Miles Archer meet prospective client Ruth Wonderly. She claims to be looking for her missing sister, who ran off from their home in New York and came to the city with a man named Floyd Thursby. Archer agrees to help get her sister back. However, later that night, the police inform Spade that Archer has been killed. Spade tries calling his client at her hotel to discover she has checked out. Back at his apartment, he is grilled by Police Detective Tom Polhaus and Lieutenant Dundy, who tell him that Thursby was murdered the same evening. Dundy suggests that Spade had the opportunity and motive to kill Thursby, who likely killed Archer.",
        "Genre": {
            "Name":"Mystery",
            "Description":"A movie designed to present a puzzle to the viewer. Sometimes involves solving a murder or caper."
        },
        "Director": {
            "Name":"John Huston",
            "Bio": "American film director, screenwriter, actor and visual artist. He wrote the screenplays for most of the 37 feature films he directed, many of which are today considered classics, including The Maltese Falcon (1941), The Treasure of the Sierra Madre (1948), The Asphalt Jungle (1950), The African Queen (1951), The Misfits (1961), Fat City (1972), The Man Who Would Be King (1975) and Prizzi's Honor (1985). During his 46-year career, Huston received 15 Academy Award nominations, winning twice. He also directed both his father, Walter Huston, and daughter, Anjelica Huston, to Oscar wins.",
            "Birth":"1906",
            "Death":"1987"
        },
        "ImageURL":"https://en.wikipedia.org/wiki/The_Maltese_Falcon_(1941_film)#/media/File:The_Maltese_Falcon_(1941_film_poster).jpg",
        "Featured":false
    },
]
// Logging
app.use(morgan('common'));

//CREATE - Add New User
app.post('/users', (req, res) => {
    const newUser = req.body;

    if(newUser.name) {
       newUser.id = uuid.v4();
       users.push(newUser);
       res.status(201).json(newUser); 
    } else {
        const message = "You must add a Name to create a New User";
        res.status(400).send(message);
    }
});

//UPDATE - Allow User to update username
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    let user = users.find( user => user.id == id); // used == because id will be presented as a number AND a string, need them to be truthy. If want to use === need to cast to make string a number or vice versa 
    
    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('No user was found to match this name');
    }
});

//UPDATE - Allow User to add a movie to favorites list
app.put('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    let user = users.find( user => user.id == id); // used == because id will be presented as a number AND a string, need them to be truthy. If want to use === need to cast to make string a number or vice versa 
    
    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to ${user.name}'s list!`)
    } else {
        res.status(400).send('No user was found to match this name. Can\'t add a movie to a list that doesn\'t exist...');
    }
});

//DELETE - Allow User to remove a movie from favorites list
app.delete('/users/:id/remove/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    let user = users.find( user => user.id == id); // used == because id will be presented as a number AND a string, need them to be truthy. If want to use === need to cast to make string a number or vice versa 
    
    if (user) {
        user.favoriteMovies.pop(movieTitle);
        res.status(200).send(`${movieTitle} has been removed ${user.name}'s list.`)
    } else {
        res.status(400).send('No user was found to match this name. Can\'t remove a movie from a list that doesn\'t exist...');
    }
});

//DELETE - Allow User to remove their account
app.delete('/users/:id/removeAccount', (req, res) => {
    const { id } = req.params;
    let user = users.find( user => user.id == id);
    
    if (user) {
        users = users.filter(user => user.id != id); //filters users array, removes anything that matches id requested and removes from array
        res.status(200).send(`${user.name}'s account has been deleted.`);
    } else {
        res.status(400).send('No user was found. Can\'t remove an account that doesn\'t exist...');
    }
});

// READ - Return list of all Users
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// READ - Return list of all movies to user
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});
// READ - Return data about a single movie
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send("No movie was found to match this title. Maybe you should add it?")
    }
});
// READ - Return data about Genre of single movie
app.get('/movies/genres/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send("No genre was found to match. You sure it exists?")
    }
});
// READ - Return data about Director by name
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName).Director;
    console.log(directorName);
    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send("No director was found to match this name. Maybe you should add them?")
    }
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