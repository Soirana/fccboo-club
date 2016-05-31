var express = require('express');
var fs = require('fs');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var dbx = require('./searcher.js');


var app = express();

passport.use(new Strategy(
  function(username, password, cb) {
    dbx.findByUsername(username, function(err, user) {
    	
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user['_id']);
});

passport.deserializeUser(function(id, cb) {
	
  dbx.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'snow drakes', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public')); 

app.use('/members', require('connect-ensure-login').ensureLoggedIn(), express.static('members'));
 



app.set('port', (process.env.PORT || 5000));



app.get('/add', function(req, res) {
	if (!req.xhr) {
		res.redirect('/');
		return;
	}
	dbx.addUser (req.query.email, req.query.password, function(err){
			res.json({error:err});
			
		});
	});
app.get ('/login', function(req, res) {
	res.redirect('/login.html')
});

app.post ('/login', 
  passport.authenticate('local', { failureRedirect: '/login.html' }),
  function(req, res) {
  	
    res.redirect('/members/allbooks.html');
  });

app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile', function(req, res) {
	if (!req.xhr) {
		res.redirect('/');
		return;
	}
	res.json({name: req.user.name, email: req.user.email, country: req.user.country,
			region: req.user.region, city: req.user.city});
});

app.get('/profileUpdate', function(req, res) {
	if (!req.xhr) {
		res.redirect('/');
		return;
	}
	dbx.editUser(req.user['_id'], req.query);
	res.json({});
	
});

app.get('/addBook', function(req, res) {
	if (!req.xhr) {
		res.redirect('/');
		return;
	}
	dbx.addBook(req.user['_id'], req.query);
	res.json({});
});


app.get('/mybooks', function(req, res) {
	if (!req.xhr) {
		res.redirect('/');
		return;
	}
	dbx.fetchBooks (req.user['_id'], function(listas){
		
		res.json({raw: listas});
	});
	
});

app.get('/allbooks', function(req, res) {
	if (!req.xhr) {
		res.redirect('/');
		return;
	}
	dbx.fetchAll (req.user['_id'], function(listas){
		
		res.json({raw: listas});
	});
	
});

app.get('/requestBook', function(req, res) {
	if (!req.xhr) {
		res.redirect('/');
		return;
	}
	dbx.newRequest(req.user['_id'], req.query.book);
	res.json({});
});

app.get('/getrequests', function(req, res) {
	if (!req.xhr) {
		res.redirect('/');
		return;
	}
	dbx.fetchRequest(req.user['_id'], function (updates){
		res.json(updates);
	});
	
});

app.get('/getPartner', function(req, res) {
	if (!req.xhr) {
		res.redirect('/');
		return;
	}
	dbx.fetchPartner(req.query.id, req.query.email, function (updates){
		res.json(updates);
	});
	
});


app.get('/removeReq', function(req, res) {
	if (!req.xhr) {
		res.redirect('/');
		return;
	}
	dbx.removeReq(req.user['_id'], req.query);
	res.json({});
});

app.get('/*', function(request, response) {
		response.redirect('/');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});