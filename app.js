const express = require('express');
const app = express();
const session = require('express-session');
const usersModel = require('./models/w1users');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
let ejs = require('ejs');
app.set('view engine', 'ejs')

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
//     // uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
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


// middleware to check for session expiration
const checkSessionExpiration = (req, res, next) => {
    if (req.session.lastActivity && Date.now() - req.session.lastActivity > 3600000) {
      // session has expired, redirect to signout route
      res.redirect('/signout');
    } else {
      // update last activity timestamp and continue with next middleware
      req.session.lastActivity = Date.now();
      next();
    }
  };
  
  // apply middleware to all routes
  app.use(checkSessionExpiration);
  



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
     
// const Joi = require('joi');
// // app.use(express.json());
// app.get('/login', async (req, res) => {

// //sanatize the input using Joi

// const schema = Joi.object({
//     password: Joi.string()
// })
  
// schema.validate({});
// // -> { value: {}, error: '"username" is required' }
// // Also -
// try {
//     const value = await schema.validateAsync({ username: req.body.password });
// }
// catch (err) { 
//     console.log(err)
//     console.log("the password must be a string")
//     return
// }

   




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
   
    

    // if (result && bcrypt.compareSync(req.body.password, result.password)) {
    if (result && req.body.password== result.password) {
        req.session.GLOBAL_AUTHENTICATED = true;
        req.session.loggedUsername = req.body.username;
        req.session.loggedPassword = req.body.password;
        req.session.loggedType = result.type;
        res.redirect('/protectedRoute');
    } else {
        res.send('Invalid username or password'
        + '<br>'
        + '<a href="/login">Try again</a>');
    }
});



// //only for authenticated users
// const authenticatedOnly = (req, res, next) => {
//     if (!req.session.GLOBAL_AUTHENTICATED) {
//         return res.status(401).json({ error: 'Not authenticated' });
//     }
//     next();
// }

const protectedRouteforAdminsOnlyMiddlewareFunction = async (req, res, next) => {
    const result = await usersModel.findOne({
        username: req.session.loggedUsername,
      
    })

        if (result?.type !== 'administrator')
     {
        return res.status(403).send('Access denied: You are not authorized to access this resource.');
    } else {
        //if no user is loged in, redirect to login page
        if (!req.session.GLOBAL_AUTHENTICATED) {
            return res.redirect('/login');
        }

    }

    
    next();
}

app.use(protectedRouteforAdminsOnlyMiddlewareFunction);

// app.use(authenticatedOnly);

app.use(express.static('public'))

app.get('/protectedRoute', protectedRouteforAdminsOnlyMiddlewareFunction, async (req, res) => {
    //serve one of the puppy images randomly
    // generate a random number between 1 and 3
    const randomImageNumber = Math.floor(Math.random() * 3) + 1;
    const imageName = `00${randomImageNumber}.jfif`;
 
const result = await usersModel.findOne({ username: req.session.loggedUsername });
const resultUsers = await usersModel.find({ username:  {$ne: req.session.loggedUsername}});

// send data to the ejs template
res.render('protectedRoute', {
    "x": req.session.loggedUsername,
    "y": imageName,
    "isAdmin": req.session.loggedType === 'administrator',
    // "todos": result.todos,
    'users': resultUsers,

});

});

app.post('/addNewToDoItem', async (req, res) => {

    // 1 - find the user
    // 2 - update the array
    // 3 - update the user's array
    const updateResult = await usersModel.updateOne({
      username: req.session.loggedUsername
    }, {
      $push: {
        todos: { "name": req.body.theLabelOfThenNewItem }
      }
    }
    )
    console.log(updateResult);
    // 4 - redirect to the protected route
    res.redirect('/protectedRoute');
  })


//   // change the admin status of a user
  
//   app.post('/flipTodoItem', async (req, res) => {
//     // 1 - find the user
//     const result = await usersModel.findOne({
//       username: req.session.loggedUsername
//     })
  
//     // 2 - update the status item (flip)
//     const newArr = result.type.map((Item) => {
//       if (todoItem.name == req.body.x) {
//         todoItem.done = !todoItem.done
//       }
//       return todoItem
//     })
  
//     // 3 - update the user's todo array
//     const updateResult = await usersModel.updateOne({
//       username: req.session.loggedUsername
//     }, {
//       $set: {
//         todos: newArr
//       }
//     }
//     )
  
//     // 4 - redirect to the protected route
//     res.redirect('/protectedRoute');
//   })
  
  

// app.post('/flipUserStatus', async (req, res) => {
//     // 1 - find the user
//     const result = await usersModel.findOne({ username: req.session.loggedUsername });

//     // 2- update the todo item (flip)
//     const newArr = result.todos.map((userItem) => {
//         if (userItem.name === req.body.x) {
//             userItem.type = ! "administrator";
//         }
//         return todoItem;
//         });

//     //3- update the users todo array
//         const updateResult = await usersModel.updateOne(
//             { username: req.session.loggedUsername }, {
//                 $set: {
//                     todos: newArr
//                 }
//             });

//     // 4- redirect to the protected route
//     res.redirect('/protectedRoute');


// });

app.post('/flipUserStatus', async (req, res) => {
    const result = await usersModel.findOne({ username: req.session.loggedUsername });

    let newUserType = result.type === 'administrator' ? 'user' : 'administrator';

    if (req.body.action === 'promote') {
        newUserType = 'administrator';
    } else if (req.body.action === 'demote') {
        newUserType = 'user';
    }

    await usersModel.updateOne(
        { username: req.body.username },
        { $set: { type: newUserType } }
    );

    res.redirect('/protectedRoute');
});










app.post('/deleteTodoItem', async (req, res) => {
    // 1 - find the user

    const result = await usersModel.findOne({ username: req.session.loggedUsername });
    // 2 - update the array

    const newArr = result.todos.filter(todoItem => 
        todoItem.name != req.body.x
    );
    
    //3 - update the user's todo array
    const updateResult = await usersModel.updateOne(
        { username: req.session.loggedUsername }, {
            $set: {
                todos: newArr
            }
        });
        
    //4 - redirect to the protected route
    res.redirect('/protectedRoute');

});


//signout route, destroy the session and redirect back to public route
app.get('/signout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// if any non-assigned URLs are entered, display a 404 error message using get()
app.get('*', (req, res) => {
    res.render('doesNotExist');
    
});



// only for admins
// const protectedRouteforAdminsOnlyMiddlewareFunction = async (req, res, next) => {
//     const result = await usersModel.findOne({
//         username: req.session.loggedUsername,
      
//     })

//     if (
//         result?.type != 'administrator'
//     ) {
//         return res.send('<h1> You are not an admin </h1>')
//     }
//     next();
// }

// app.use(protectedRouteforAdminsOnlyMiddlewareFunction);


// app.get('/protectedRouteforAdminsOnly', (req, res) => {
//     res.send('<h1>protectedRouteAdminsonly</h1>');
// });



module.exports = app;
