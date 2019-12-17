//Express installing
var express = require('express');
var app = express();
var logger = require('morgan');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Router
var router = express.Router();
module.exports = router;

//File-system
var fs = require('fs');

//Set up CORS
let cors = require('cors');
var corsOptions = {
  origin:'http://localhost:3000',
  credentials:true
};
app.use(cors(corsOptions));

//Cookies
var cookieParser = require('cookie-parser');
app.use(cookieParser());

/*
 * Handle preflighted request
 */
router.options("/*", cors());
router.get('/',cors(), function(req, res, next) {
  res.send('Backend is working');
});

/* GET users listing. */
router.get('/init', cors(corsOptions), function(req, res, next){
  if (req.cookies['userID']){
    res.send(req.cookies['userID']['username']);
  }
  else{
    let file = "";
    res.send(file);
  }

})

/* POST request for login*/
router.post('/login', cors(corsOptions), function(req, res){
  let db = req.db;
  let username = req.body.username;
  let password = req.body.password;
  let collection = db.get('userList');
  collection.find({'username': username,'password': password},{},function(err,docs){
    if (err === null){
      let cookie = {"_id": docs[0]._id, "username": docs[0].username, "friends": docs[0].friends};
      // let cookie = {"_id": docs[0].id, "username": docs[0].username, "friends": docs[0].friends};

      res.cookie("userID", cookie, {expire: 3600000 + Date.now()});
      let user_friends = docs[0]['friends'];
      let ListofFriends = [];
      let response = {'person': docs[0].username, '_id': docs[0]._id};
      const find = async (user_friends) => {
        try {
          for (let i = 0; i < user_friends.length; i++) {
            const item = await collection.findOne({"username": user_friends[i]});
            let this_friend = {"username": item['username'], "_id": item["_id"]};
            ListofFriends.push(this_friend);
          }
        } finally {
        }

      };

      function findAllFriends(user_friends) {
        response['friendsList'] = user_friends;
        res.send(response);
         console.log(response);
      }

      find(user_friends).then(r => findAllFriends(ListofFriends));
    }
    else{
      res.send({msg: "Login Failed"});
    }
  });
});

/* Logout of sessions */
router.get('/logout', cors(corsOptions), function (req, res){
  // console.log(req.cookies[userID]);
  res.clearCookie("userID");
  res.send("");
})


/* GET request for logout and unset cookie */
router.get('/logout', cors(corsOptions), function(req, res){
  let name = req.body;
  res.clearCookie(name);
  res.send("Logged Out!");
});

/* GET request for photo albums*/
router.get('/getalbum/:userid', cors(corsOptions), (req, res, next) => {
  let db = req.db;
  let collection = db.get('photoList');
  let userID = req.params.userid.toString();
  let currentUserID = req.cookies['userID']['_id'];
  console.log(userID)
  if (userID !== "0") {
    let restriction = {userid: userID};
    collection.find(restriction, {}, function (err, docs) {
      if (err === null)
        {console.log(docs)
        res.json(docs);}
      else res.send({msg: err});
    });
  } else {
    let restriction = {userid: currentUserID};
    collection.find(restriction, {}, function (err, docs) {
      if (err === null)
        {console.log(docs)
        res.json(docs);}
      else res.send({msg: err});
    });
  }
});
/* GET request for uploading pictures*/
router.post('/uploadphoto', cors(corsOptions), function (req, res) {

  let db = req.db;
  let collection = db.get('photoList');
  let random_name = Math.round(Math.random() * 1000000).toString() + ".jpg";
  let path = "./public/uploads/" + random_name;
  let absolute_path = "http://localhost:3002/uploads/" + random_name;
  req.pipe(fs.createWriteStream(path));
  let userLogin = req.cookies.userID._id;
  let putting = {"url": absolute_path, "userid": userLogin, "likedby": []};
  collection.insert(putting, function (err, result) {
    res.send(
        (err === null) ? {msg: 'Inserted', data: putting} : {msg: err}
    );
  });
});

/* Updating like for pictures*/
router.post('/updateLike/:photoid', cors(corsOptions), function (req, res) {
  let db = req.db;
  let collection = db.get('photoList');
  let photoToUpdate = req.params.photoid;
  let userLogin = req.cookies.userID.username;
  let filter = {"_id": photoToUpdate};
  collection.findOneAndUpdate(filter, {$addToSet: {"likedby": userLogin}}, function (err, result) {
    res.send(
        (err === null) ? {result} : {msg: err}
    );
  })
});

/*Delete request to delete pictures from Album*/
router.delete('/deletephoto/:photoid', cors(corsOptions), function (req, res) {
  let db = req.db;
  let collection = db.get('photoList');
  let photoToDelete = req.params.photoid;
  let filter = {"_id": photoToDelete};
  collection.findOneAndDelete(filter, function (err, result) {
    let path = "./public/uploads/";
    let url = result['url'].replace("http://localhost:3002/uploads/", "");
    path += url;
    fs.unlinkSync(path);
    res.send((err === null) ? {result} : {msg: err});
  });
});

module.exports = router;
