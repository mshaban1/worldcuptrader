const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const config = require("./config.js");
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
  }

// Requiring the `User` model for accessing the `users` collection
var User = require("./models/user.js");

// Use morgan logger for logging requests
app.use(morgan("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// Use Passport to authenticate the User
app.use(passport.initialize());
// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost/Traders", {
  useMongoClient: true
});


// Configure body parser for AJAX requests
app.use(bodyParser.json());
// Serve up static
app.use(express.static("../client/build"));


// Set up the strategy to accept Local authentication
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

app.post('/register', function(req, res) {
  console.log('req body: ', req.body);
    if (!req.body.email || !req.body.username || !req.body.password)
      {
        // email address is absolutely necessary for user creation
        res.json({
            success: false,
            message: 'email, username and password required',
            data: {}
        });
        return;
      }
        // see if users exist with the given userName and/or emailAddress
        console.log('email sent ', req.body.email);
        User.find(
          {
                'email': req.body.email
          }
        , function(err, foundUsers) {
            if (err) {
                res.status(400);
                res.json({
                    success: false,
                    message: 'Error occured while checking if the user exists',
                    data: {
                        'error': err
                    }
                });
                return;
            }
            console.log('found*********** ',foundUsers);
            if (foundUsers && foundUsers.length > 0 ) {
                console.log('founder user: ' + foundUsers);
                // if users are found, we cannot create the user
                // send an appropriate response back
                res.status(204);
                res.json({
                    success: false,
                    message: 'User with requested username and/or email already exists',
                    data: {}
                });
                return;
            } else {
                // create the user with specified data
                var user = new User();
                console.log('create user: ', req.body);
                user.email =     req.body.email;
                user.password =  req.body.password;
                user.username =  req.body.username;
                user.save(function(err) {
                    if (err) {
                        res.json({
                            success: false,
                            message: 'Error occured while saving the user',
                            data: {
                                'error': err
                            }
                        });
                        return;
                    }
                    var payload = {
                        'username': user.username,
                        'email': user.email
                    };
                    var token = jwt.sign(payload, config.jwt.secret, {
                        expiresIn: 14400*360
                    });
                    res.json({
                        success: true,
                        message: 'User added/created successfully',
                        data: {

                            'token': token
                        }
                    });
                    return;
                });
            }
        });
});

app.post('/login', function(req, res) {
	passport.authenticate("local", (err, user, info) => {
	if (err) {
      res.status(401).json(err);
      return;
    }

    if (user) {
      const token = jwt.sign({
      	data: user
      }, 'Black Lotus', { expiresIn: '1h' });
      res.status(200).json({
        userInfo: user,
        token: token
      });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
});

app.get('/usersList/', function(req, res) {
    User.find({},function(err, users) {
        if (err) return res.send(err);
       var userMap = {};
  
      users.forEach(function(user) {
       userMap[users._id] = user;
    });
      res.send(users);  
    });
  });

app.get('/userHas/:username', function(req, res) {
    User.find({username: req.params.username }, function(err, users) {
        console.log(users[0].has)
        res.send(users[0].has)
    });
});

app.get('/userNeeds/:username', function(req, res) {
    User.find({username: req.params.username}, function(err, users) {
        res.send(users[0].needs)
    });

});

app.post('/updateUser', function(req, res) {
    console.log('key: ' + req.body.key)
    console.log('value: ' + req.body.value)
    console.log('username: ' + req.body.username)
    User.findOneAndUpdate(
        {username: req.body.username},
        {[req.body.key]: req.body.value}
    );
});

const server = app.listen(PORT)

// Establish the connection
const io = require('socket.io').listen(server);

io.on('connection', (client) => {
	console.log('CONNECTED WOOOOOOOOOOOOOO');

	client.on('message', (data) => {
		console.log('message broadcasted from ' + data.username)
		client.broadcast.emit('message', data)
	})
	
})

// Set the socket up to listen on a unique PORT and start running it

app.get('/usersList', function(req, res) {
    User.find({},function(err, users) {
        if (err) return res.send(err);
        var userMap = {};
  
      users.forEach(function(user) {
        userMap[users._id] = user;
      });
  
      res.send(users);  
    });
  });