const express = require('express');
const app = express();
const session = require('express-session');
const usersModel = require('./models/w1users');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

// var MongoDBStore = require('connect-mongodb-session')(session);

// app.use(session({
//   secret: 'foo',
//   store: MongoStore.create(options)
// }));

const dotenv = require('dotenv');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



// var dbStore = new MongoDBStore({
//     uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
//     // uri: 'mongodb+srv://${process.env.ATLAS_DB_USER}:${process.env.ATLAS_DB_PASSWORD}@assignment3.bqyrq6k.mongodb.net/comp2537w1?retryWrites=true&w=majority',
//     collection: 'mySessions',
//     // connectionOptions: {
//     //     connectTimeoutMS: 300000000 
//     // }
// });

// dbStore.on('error', function (error) {
//     console.log('Error connecting to MongoDB:', error);
// });

app.use(session({
    secret: 'secret secret secret',
    // store: dbStore,
}));





//public route
app.get('/', (req, res) => {

    // if user is authenticated, redirect to protected route
    //if the user is not authenticated, show a login button and a sign up button
    // if the login button is pressed, redirect to login route
    // if the sign up button is pressed, redirect to sign up route
    if (req.session.GLOBAL_AUTHENTICATED) {
        res.redirect('/protectedRoute');
    } else {
        res.send(
            '<a href="/login">Login</a>'
            + '<br>'
            + '<a href="/signup">Sign up</a>'
        );
    }
// res.send('Hello World');

});


// login route


// // signup route
// // display "create user" and have name, username, password, and type fields and a submit button. Type is always set to non-administrator.

// app.get('/signup', (req, res) => {
//     res.send(
//         '<form action="/signup" method="post">'
//         + '<input type="text" name="username" placeholder="Enter your username" />'
//         + '<br>'
//         + '<input type="password" name="password" placeholder="Enter your password" />'
//         + '<br>'
//         + '<input type="text" name="type" value="non-administrator" readonly />'
//         + '<br>'
//         + '<button type="submit">Create User</button>'
//         + '<br>'
//         + '</form>'
//     )

// });

// //if either username or password is missing, display an error message
//     //if the username already exists, display an error message
//     //if the username and password are valid, create a new user and redirect to the login route
// app.post('/signup', async (req, res) => {
//     //check if username and password are valid
//     //if valid, create a new user
//     //if not valid, display an error message
//     //if username already exists, display an error message
//     //if username and password are valid, create a new user and redirect to the login route
//     const result = await usersModel.findOne({
//         username: req.body.username,
//     })
//     if (result) {
//         res.send('Username already exists');
//     } else {
//         const newUser = new usersModel({

//             username: req.body.username,
//             password: bcrypt.hashSync(req.body.password, 10),
//             type: req.body.type,
//         });
//         await newUser.save();
//         res.redirect('/login');
//     }
// });



// signup route
app.get('/signup', (req, res) => {
    res.send(
        '<form action="/signup" method="post">'
        + '<input type="text" name="name" placeholder="Enter your Name" />'
        + '<br>'
        + '<input type="text" name="username" placeholder="Enter your username" />'
        + '<br>'
        + '<input type="password" name="password" placeholder="Enter your password" />'
        + '<br>'
        + '<input type="hidden" name="type" value="non-administrator" readonly />'
        + '<br>'
        + '<button type="submit">Create User</button>'
        + '<br>'
        + '</form>'
    )
});

// handle form submission
app.post('/signup', async (req, res) => {
    // check for missing username or password fields
    if (!req.body.name && !req.body.username && !req.body.password) {
        res.send('Please enter your name, username, and password'
        + '<br>'
            + '<a href="/signup">Try again</a>');
        return;
    } else if (!req.body.name && !req.body.username) {
        res.send('Please enter your name and username'
        + '<br>'
        + '<a href="/signup">Try again</a>');
        return;
    } else if (!req.body.name && !req.body.password) {
        res.send('Please enter your name and password'
        + '<br>'
        + '<a href="/signup">Try again</a>');
        return;
    } else if (!req.body.username && !req.body.password) {
        res.send('Please enter your username and password'
        + '<br>'
        + '<a href="/signup">Try again</a>');
        return;
    } else if (!req.body.name) {
        res.send('Please enter your name'
        + '<br>'
        + '<a href="/signup">Try again</a>');
        return;
    } else if (!req.body.username) {
        res.send('Please enter your username'
        + '<br>'
        + '<a href="/signup">Try again</a>');
        return;
    } else if (!req.body.password) {
        res.send('Please enter your password'
        + '<br>'
        + '<a href="/signup">Try again</a>');
        return;
    }

    // check if username already exists
    const result = await usersModel.findOne({ username: req.body.username });
    if (result) {
        res.send('Username already exists'
        + '<br>'
        + '<a href="/signup">Try again</a>');
        return;
    }

    // create new user and redirect to login page
    const newUser = new usersModel({
        name: req.body.name,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        type: req.body.type,
    });
    await newUser.save();
    res.redirect('/login');
});
     
app.get('/login', (req, res) => {
    res.send(
        '<form action="/login" method="post">'
        + '<input type="text" name="username" placeholder="Enter your username" />'
        + '<input type="password" name="password" placeholder="Enter your password" />'
        + '<button type="submit">Login</button>'
        + '</form>'
    )
});



// GLOBAL_AUTHENTICATED = false;
app.use(express.urlencoded({ extended: false }));
// app.post('/login', async (req, res) => {
//     //set a global variable to true if the user is authenticated
//     const result = await usersModel.findOne({

//         username: req.body.username,
//     })


//     if (
//         bcrypt.compareSync(req.body.password, result.password)) {
//         req.session.GLOBAL_AUTHENTICATED = true;
//         req.session.loggedUsername = req.body.username;
//         req.session.loggedPassword = req.body.password;
//     res.redirect('/protectedRoute');
//         } else {
//             res.send('Invalid username or password');
//         }
// });

app.post('/login', async (req, res) => {
    //set a global variable to true if the user is authenticated
    const result = await usersModel.findOne({
        username: req.body.username,
    })

    if (result && bcrypt.compareSync(req.body.password, result.password)) {
        req.session.GLOBAL_AUTHENTICATED = true;
        req.session.loggedUsername = req.body.username;
        req.session.loggedPassword = req.body.password;
        res.redirect('/protectedRoute');
    } else {
        res.send('Invalid username or password'
        + '<br>'
        + '<a href="/login">Try again</a>');
    }
});


//only for authenticated users
const authenticatedOnly = (req, res, next) => {
    if (!req.session.GLOBAL_AUTHENTICATED) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
}

app.use(authenticatedOnly);

app.use(express.static('public'))

app.get('/protectedRoute', (req, res) => {
    //serve one of the puppy images randomly
    // generate a random number between 1 and 3
    const randomImageNumber = Math.floor(Math.random() * 3) + 1;
    const imageName = `00${randomImageNumber}.jfif`;
    const loggedName = req.session.name;
    const helloMessage = loggedName ? `Hello ${loggedName}` : 'Hello';
    const HTMLresponse = `
    ${helloMessage}
    <br>
    <img src="${imageName}" />
    <br>
    <a href="signout">Sign Out</a>
`;






     
     
     //if inactive for one hour, redirect to signout route
        //if the user is active, reset the timer
        req.session.cookie.maxAge = 3600000;


    res.send(HTMLresponse);
});

//signout route, destroy the session and redirect back to public route
app.get('/signout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});










//only for admins
const protectedRouteforAdminsOnlyMiddlewareFunction = async (req, res, next) => {
    const result = await usersModel.findOne({
        username: req.session.loggedUsername,
      
    })

    if (
        result?.type != 'administrator'
    ) {
        return res.send('<h1> You are not an admin </h1>')
    }
    next();
}

app.use(protectedRouteforAdminsOnlyMiddlewareFunction);


app.get('/protectedRouteforAdminsOnly', (req, res) => {
    res.send('<h1>protectedRouteAdminsonly</h1>');
});

// if any non-assigned URLs are entered, display a 404 error message using get()
app.get('*', (req, res) => {
    res.status(404).send('404 Error: Page not found');
});

module.exports = app;
