const express = require('express');
const app = express();
const session = require('express-session');
const usersModel = require('./models/w1users');

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}   );  


// const users  = [
//     {
//     username: 'admin',
//     password: 'admin',
//     type: 'administrator'

//     },
//     { 
//     username: 'user1',
//     password: 'pass1', 
//     tyep: 'non-administrator'
//     }
// ]

app.use(session({   
    secret : 'secret secret secret',
}));


    
    


//public route
app.get('/', (req, res) => {
    res.send('Hello World');
}   );


app.get('/login', (req, res) => {
    res.send(
        '<form action="/login" method="post">'  
        + '<input type="text" name="username" placeholder="Enter your username" />'
        + '<input type="password" name="password" placeholder="Enter your password" />'
        + '<button type="submit">Login</button>'
        + '</form>'
    );
}   );

// GLOBAL_AUTHENTICATED = false;
app.use(express.urlencoded({ extended: false }));
app.post('/login', async (req, res) => {  
    //set a global variable to true if the user is authenticated
    const result = await usersModel.find({

        username: req.body.username,
        password: req.body.password
    })
        

    if (
        result ) {
        req.session.GLOBAL_AUTHENTICATED = true;
        req.session.loggedUsername = req.body.username;
        req.session.loggedPassword = req.body.password;
        
    }
    res.redirect('/');
  });  


//only for authenticated users
const authenticatedOnly = (req, res, next) => {
    if (!req.session.GLOBAL_AUTHENTICATED) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
       next();
    }

app.use(authenticatedOnly);

app.get('/protectedRoute', (req, res) => {
    res.send('<h1>protectedRoute</h1>');
}   );


//only for admins
const protectedRouteforAdminsOnlyMiddlewareFunction = async (req, res, next) => {
    const result = await usersModel.findOne({
        username: req.session.loggedUsername,
        password: req.session.loggedPassword
    })
        
    if ( 
        result?.type != 'administrator'
        )
     {
        return res.send('<h1> You are not an admin </h1>')
    }
       next();
    }

app.use(protectedRouteforAdminsOnlyMiddlewareFunction);


app.get('/protectedRouteforAdminsOnly', (req, res) => {
    res.send('<h1>protectedRouteAdminsonly</h1>');
}   );

module.exports = app;
