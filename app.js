const express = require('express');
const app = express();
const session = require('express-session');
const usersModel = require('./models/w1users');
const bcrypt = require('bcrypt');


var MongoDBStore = require('connect-mongodb-session')(session);

// app.use(session({
//   secret: 'foo',
//   store: MongoStore.create(options)
// }));


var dbStore = new MongoDBStore({
    // uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
    uri: 'mongodb://127.0.0.1:27017/connect_mongodb_session_test',
    collection: 'mySessions',
    // connectionOptions: {
    //     connectTimeoutMS: 300000000 
    // }
});

dbStore.on('error', function (error) {
    console.log('Error connecting to MongoDB:', error);
});


app.use(session({
    secret: 'secret secret secret',
    store: dbStore,
}));






//public route
app.get('/', (req, res) => {
    res.send('Hello World');
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
app.post('/login', async (req, res) => {
    //set a global variable to true if the user is authenticated
    const result = await usersModel.findOne({

        username: req.body.username,
    })


    if (
        bcrypt.compareSync(req.body.password, result.password)) {
        req.session.GLOBAL_AUTHENTICATED = true;
        req.session.loggedUsername = req.body.username;
        req.session.loggedPassword = req.body.password;
    res.redirect('/');
        } else {
            res.send('Invalid username or password');
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
    HTMLresponse =
    ` <h1> Protected Route </h1>
    <br>
    <img src="${imageName}" />`

    res.send(HTMLresponse);
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

module.exports = app;
