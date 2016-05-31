var Datastore = require('nedb');
var db = new Datastore({ filename: 'users.db', autoload: true });
var bookdb = new Datastore({ filename: 'books.db', autoload: true });
var requestdb = new Datastore({ filename: 'requests.db', autoload: true });


exports.findById = function(id, cb) {

  db.find({_id: id},function(err, docs) {
    if (docs.length === 0) {
      cb(new Error('User ' + id + ' does not exist'));
    }
    cb(null, docs[0]);
  });
}

exports.findByUsername = function(username, cb) {
  
  db.find({email: username},function(err, docs) {
    if(docs.length>0){
      return cb(null, docs[0]);
    }
    return cb(null, null); 
  })
}

exports.addUser = function(email, password, cb) {
  db.find({email: email},function(err, docs) {
    if(docs.length>0 || err){
      return cb(true);
    }

    db.insert({email: email, password: password, name: "", country: "", region :"", city:"", books:[]});
    return cb(false);
  })
}

exports.editUser = function(id, update) {
  db.find({_id: id},function(err, docs) {
    if (docs.length === 0) {
      return ;
    }
    if (update.hasOwnProperty('name')){
      docs[0].name = update.name;
    }
    if (update.hasOwnProperty('country')){
      docs[0].country = update.country;
    }
    if (update.hasOwnProperty('region')){
      docs[0].region = update.region;
    }
    if (update.hasOwnProperty('city')){
      docs[0].city = update.city;
    }
    var replacer = docs[0];
    db.update({ _id: id }, { $set: {name: replacer.name, country: replacer.country, 
    city: replacer.city, region: replacer.region}}, {}, function () {
      });
  return;
  });
};

exports.addBook = function(id, book) {
  //book.author is a list
  bookdb.find({ISBN: book.ISBN},function(err, docs) {
     if (docs.length ===0) {
      bookdb.insert(book);
    }
  db.update({_id: id},{ $addToSet: { books: book} },{},function(){});
  });
};

exports.fetchBooks = function(id,cb) {
  db.find({_id: id},function(err, docs) {
    if (docs.length === 0) {
      return cb([]);
    }
    return cb (docs[0].books);
  });
};

exports.fetchAll = function(id,cb) {
  
  bookdb.find({},function(err, docs) {
    if (docs.length === 0) {
      return cb([]);
    }
    for (var i = 0; i < docs.length; i++) {
      delete docs[i]['_id'];
    }
    return cb (docs);
  });
};

exports.newRequest = function(id, book) {
  
  db.find({_id: id},function(err, docs) {
    if (docs.length ===0){
      return;
    }
    var check = false;
    for (var i = 0; i < docs[0].books.length; i++) {
      if (docs[0].books[i].ISBN === book.ISBN){
        check = true;
        break;
      }
    }
    if (check) {
       return;
    }
    db.find({books:book},function(err, docums) {
      
      for (i = 0; i < docums.length; i++) {
        requestdb.insert({wants: docs[0]['_id'], owner: docums[i]['_id'], book: book, accepted: false});
        
      }
    });

    });
  };
  


exports.fetchRequest = function(id, cb) {
    var returnValues={wishes:[],requests: [], accepted:[]};
    var tempWishes=[];
    requestdb.find({wants: id},function(err, docs) {
      for (var i = 0; i < docs.length; i++) {
        if (docs[i].accepted) {
          returnValues.accepted.push({book: docs[i].book, partner: docs[i].owner,id: docs[i]['_id']});
          //generate email on client side as additional request
        } else{
          tempWishes.push({book: docs[i].book, id: docs[i]['_id']});
        }
      }
      requestdb.find({owner: id},function(err, docums) {
        for (var i = 0; i < docums.length; i++) {
          if (docums[i].accepted) {
            returnValues.accepted.push({book: docums[i].book, partner: docums[i].wants, id: docums[i]['_id']});
          } else{
            returnValues.requests.push({book: docums[i].book, partner: docums[i].wants, id: docums[i]['_id']});
          }
        }
        for (var i = 0; i < tempWishes.length; i++) {
          for (var j = 0; j < returnValues.wishes.length; j++) {
            if (tempWishes[i].book.ISBN  === returnValues.wishes[j].book.ISBN) {
              break;
            }
          }
          if (j===returnValues.wishes.length) {
            returnValues.wishes.push(tempWishes[i]);              
          }
        }
        return cb(returnValues);
      });
    });
};

exports.fetchPartner = function(id, email, cb) {
  db.find({_id: id},function(err, docs) {
    if (docs.length === 0) {
      return cb({name:"", location: "", email:""});
    }
    var locate = docs[0].country+', '+docs[0].region +', '+docs[0].city;
    var mailString = "";
    if (email !== 'false') {
      mailString = docs[0].email;
    }
    return cb({name: docs[0].name, location: locate, email: mailString});
  });
};

exports.removeReq = function(id, objekt) {
//obj.type - wish, request, accepted,obj.ISBN for wishes, id for others?
  if (objekt.type === 'wish') {
    requestdb.remove({wants: id, 'book.ISBN': objekt.ISBN}, { multi: true }, function(err, numb) {
      
      return;
    });
  }

  if (objekt.type === 'accept') {
    requestdb.update({_id: objekt.id}, { $set: {accepted: true}}, {}, function (err, numb) {
      return;
      });
    
  }
  if (objekt.type === 'delete') {
    requestdb.remove({ _id: objekt.id}, {}, function (err, numRemoved) {
    });
  }
};