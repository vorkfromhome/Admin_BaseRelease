var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var autoIncrement = require("mongodb-autoincrement");

var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/mydb';

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
//app.use(session(sess))



router.get('/myval', function (req, res, next) {
    sess = req.session;
    req.session.myval2="30011";
    console.dir(sess);
    res.json({
                "status": "Success"
                , 'items': sess
            });
});

router.get('/mygetval', function (req, res, next) {
    res.json({
                "status": "Success"
                , 'items': req.session.myval2
            });
});



var tempmob = 0;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        result: 'Sample test'
    });
});
-
/* GET home page. */
router.get('/profileregister', function (req, res, next) {
    
    var items = {
        "name": req.query.name
        , "email": req.query.email
        , "secure_question": req.query.secure_question
        , "secure_answer": req.query.secure_answer
        , "country": req.query.country
        , "state": req.query.state
        , "zip": req.query.zip
        , "doorno": req.query.doorno
        , "floor": req.query.floor
        , "addressone": req.query.addressone
        , "addresstwo": req.query.addresstwo
        , "taluk": req.query.taluk
    , };
    var conditions = {
        "mobilenum": req.session.temp_mob
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('userdata').updateOne(conditions, {
            $set: items
            , $currentDate: {
                "lastModified": true
            }
        }, function (err, result) {
            assert.equal(err, null);
            res.json({
                "status": items
            });
        });
    });
    
});
/* GET home page. */
router.get('/profiletworegister', function (req, res, next) {
    var items = {
        "busname": req.query.busname
        , "tin": req.query.tin
        , "licensenum": req.query.License
        , "vat": req.query.vat
        , "fax": req.query.FAX
        , "busphone": req.query.busmobile
        , "busmail": req.query.email
    };
    var conditions = {
        "mobilenum": req.session.temp_mob
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('userdata').updateOne(conditions, {
            $set: items
            , $currentDate: {
                "lastModified": true
            }
        }, function (err, result) {
            assert.equal(err, null);
            res.json({
                "status": "success"
                , "items": items
            });
        });
    });
});
//GET home page. 
router.get('/checkmobnum', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var conditions = {
            "mobilenum": req.query.mobilenum
            , "status": "1"
        };
        db.collection('userdata').find(conditions).toArray(function (err, result) {
            assert.equal(err, null);
            if (result != null) {
                var count = result.length
                res.json({
                    "count": count
                });
            }
            else {
                res.json({
                    "count": "0"
                });
            }
        });
    });
});
-
//GET home page. 
router.get('/createotpagain', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var conditions = {
            "mobilenum": req.session.temp_mob
            , "status": "1"
            , "active": "0"
        };
        var items = {
            "otp": req.query.otpagain
        };
        var update = db.collection('userdata').updateOne(conditions, {
            $set: items
            , $currentDate: {
                "lastModified": true
            }
        }, function (err, result) {
            assert.equal(err, null);
            res.json({
                "status": update
                , "items": items
            });
        });
    });
});
router.get('/userlogin', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var conditions = {
            "mobilenum": req.query.username
            , "password": req.query.password
            , "status": "1"
            , "active": "1"
        };
        db.collection('userdata').find(conditions).toArray(function (err, result) {
            assert.equal(err, null);
            if (result != null) {
                var count = result.length
                res.json({
                    "loginstatus": count
                    , "items": conditions
                });
                req.session.usermob = req.query.username;
            }
            else {
                res.json({
                    "loginstatus": "0"
                });
            }
        });
    });
});
router.get('/forgetpass', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var conditions = {
            "mobilenum": req.query.username
            , "secure_question": req.query.securityquestion
            , "secure_answer": req.query.qustnanswer
            , "status": "1"
            , "active": "1"
        };
        var items = {
            "password": "87654321"
        };
        db.collection('userdata').find(conditions).toArray(function (err, result) {
            assert.equal(err, null);
            if (result != null) {
                var count = result.length
                if (count > 0) {
                    var update = db.collection('userdata').updateOne(conditions, {
                        $set: items
                        , $currentDate: {
                            "lastModified": true
                        }
                    }, function (err, result) {
                        assert.equal(err, null);
                        res.json({
                            "status": conditions
                            , "items": items
                        });
                    });
                }
            }
            else {
                res.json({
                    "count": "0"
                });
            }
        });
    });
});
/* GET Product Details. */
router.get('/products', function (req, res, next) {
    var otpdigits = Math.floor(Math.random() * 100000 + 1);
    var items = {
        "type": "1"
        , "imagename": 'totm.jpg'
        , "name": "tommato"
        , "kg": "1"
        , "price": "10"
        , "store": [
            {
                "name": "ghi"
                , "location": "bbbb"
                , "price": "10"
                , "star": "3"
            }
            , {
                "name": "abc"
                , "location": "aaaa"
                , "price": "12"
                , "star": "2"
            }
            , {
                "name": "def"
                , "location": "dddd"
                , "price": "14"
                , "star": "1"
            }
       ]
    };
    console.dir(items);
    var insertDocument = function (db, callback) {
        db.collection('products').insertOne(items, function (err, result) {
            assert.equal(err, null);
            res.json({
                "status": "Success"
                , 'items': items
            });
            callback();
        });
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        insertDocument(db, function () {
            db.close();
        });
    });
});
//GET home page. 
router.get('/dashboard', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
       var cattype = req.query.cattype.split(',');
        var conditions = {
            "type": req.query.type
        };
        if (req.query.search != "") {
            conditions = {
                "type": req.query.type
                , "name": {
                        '$regex': req.query.search
                    }
            };
        }
         console.log(conditions);
        if(req.query.cattype != '')
        {
            conditions.category = {
                $in: cattype
            };
           
        }
       
        db.collection('products').find(conditions).toArray(function (err, result) {
            assert.equal(err, null);
            res.json({
                "status": "success"
                , "result": result
                , 'cond': conditions
            });
        }); 
    });
});
//GET home page. 
router.get('/dashboardtwo', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var ObjectId = require('mongodb').ObjectID;
        var conditions = {
            "_id": ObjectId(req.query.id)
        }
        console.log(conditions);
        db.collection('products').find(conditions).toArray(function (err, result) {
            assert.equal(err, null);
            res.json({
                "status": "success"
                , "result": result
            });
            console.log(result);
        });
    });
});
//GET home page. 
router.get('/dashboardtwostores', function (req, res, next) {
    res.json([{
        "label": "Store Price"
        , "color": "#9289ca"
        , "data": [["store1", 8], ["store2", 14], ["store3", 11]]
    }]);
});
//GET home page. 
router.get('/dashboardtwoweekprice', function (req, res, next) {
    res.json([{
        "label": "week price"
        , "color": "#23b7e5"
        , "data": [["1", 70], ["2", 20], ["3", 70], ["4", 85], ["5", 59], ["6", 93], ["7", 66]]
    }]);
});
//GET home page. 
router.get('/listcart', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var hoaArray = [];
        var inputArray = req.query.cart.split(',');
        var ObjectId = require('mongodb').ObjectID;
        console.log(inputArray);
        for (var i = 0; i < inputArray.length; i++) {
            hoaArray.push(ObjectId(inputArray[i]));
        }
        //var ObjectId = require('mongodb').ObjectID;
        var conditions = {
            "_id": {
                $in: hoaArray
            }
        };
        console.log(conditions);
        db.collection('products').find(conditions).toArray(function (err, result) {
            assert.equal(err, null);
            console.log(result);
            res.json({
                "status": "success"
                , "result": result
                , 'cond': conditions
            });
        });
    });
});
//GET home page. 
router.get('/searchdataitems', function (req, res, next) {
    res.json([
        {
            name: 'Adam'
            , email: 'adam@email.com'
            , age: 10
        }
        , {
            name: 'Amalie'
            , email: 'amalie@email.com'
            , age: 12
        }
        , {
            name: 'Wladimir'
            , email: 'wladimir@email.com'
            , age: 30
        }
        , {
            name: 'Samantha'
            , email: 'samantha@email.com'
            , age: 31
        }
        , {
            name: 'Estefanía'
            , email: 'estefanía@email.com'
            , age: 16
        }
        , {
            name: 'Natasha'
            , email: 'natasha@email.com'
            , age: 54
        }
        , {
            name: 'Nicole'
            , email: 'nicole@email.com'
            , age: 43
        }
        , {
            name: 'Adrian'
            , email: 'adrian@email.com'
            , age: 21
        }
          ]);
});
router.get('/addcontacts', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('addrequest').aggregate(
            // Pipeline
	[
		// Stage 1
                {
                    $lookup: {
                        "from": "userdata"
                        , "localField": "receiver"
                        , "foreignField": "mobilenum"
                        , "as": "setdata"
                    }
		},

		// Stage 2
                {
                    $match: {
                        "status": "1"
                        , "activation": "1"
                        , "sender": req.query.search
                    }
		},

	]
            // Created with 3T MongoChef, the GUI for MongoDB - https://3t.io/mongochef
        ).toArray(function (err, result) {
            assert.equal(err, null);
            res.json({
                "status": "success"
                , "result": result
            });
        });
    });
});
router.get('/addcontacts2', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var fulldata = [];
        db.collection('addrequest').aggregate(
            // Pipeline
	[
		// Stage 1
                {
                    $lookup: {
                        "from": "userdata"
                        , "localField": "sender"
                        , "foreignField": "mobilenum"
                        , "as": "setdata"
                    }
		},

		// Stage 2
                {
                    $match: {
                        "status": "1"
                        , "activation": "1"
                        , "receiver": req.query.search
                    }
		},

	]
            // Created with 3T MongoChef, the GUI for MongoDB - https://3t.io/mongochef
        ).toArray(function (err, result) {
            assert.equal(err, null);
            res.json({
                "status": "success"
                , "result": result
            });
        });
    });
});
router.get('/addcontactsreqst', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var fulldata = [];
        db.collection('addrequest').aggregate(
            // Pipeline
	[
		// Stage 1
                {
                    $lookup: {
                        "from": "userdata"
                        , "localField": "sender"
                        , "foreignField": "mobilenum"
                        , "as": "setdata"
                    }
		},

		// Stage 2
                {
                    $match: {
                        "status": "1"
                        , "activation": "0"
                        , "receiver": req.query.search
                    }
		},

	]
            // Created with 3T MongoChef, the GUI for MongoDB - https://3t.io/mongochef
        ).toArray(function (err, result) {
            assert.equal(err, null);
            res.json({
                "status": "success"
                , "result": result
            });
        });
    });
});
router.get('/addcontactsearch', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var conditions = {
            "name": {
                '$regex': req.query.search
            }
            , "mobilenum": {
                $ne: req.query.usernum
            }
            , "status": "1"
            , "active": "1"
        };
        db.collection('userdata').find(conditions).toArray(function (err, result) {
            assert.equal(err, null);
            res.json({
                "status": "success"
                , "result": result
                , 'cond': conditions
            });
        });
    });
});
//GET home page. 
router.get('/updatefriendslist', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var ObjectId = require('mongodb').ObjectID;
        var useractive = ObjectId(req.query.useractive);
        var conditions = {
            "_id": useractive
            , "status": "1"
        };
        var items = {
            "activation": req.query.useractive
        };
        var update = db.collection('addrequest').updateOne(conditions, {
            $set: items
            , $currentDate: {
                "lastModified": true
            }
        }, function (err, result) {
            assert.equal(err, null);
            res.json({
                "status": update
                , "items": items
            });
        });
    });
});
/* GET home page. */
router.get('/addrequest', function (req, res, next) {
    var items = {
        "sender": req.query.sender
        , "receiver": req.query.receiver
        , "activation": req.query.activation
        , "status": req.query.status
    , };
    var insertDocument = function (db, callback) {
        db.collection('addrequest').insertOne(items, function (err, result) {
            assert.equal(err, null);
            res.json({
                "status": "Success"
                , 'items': items
            });
            callback();
        });
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        insertDocument(db, function () {
            db.close();
        });
    });
});
/* GET home page. */
router.get('/dashboardfavrlist', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var conditions = {
            "usernum": req.query.saveuser
            , "status": "1"
        };
        db.collection('favrlist').find(conditions).toArray(function (err, result) {
            assert.equal(err, null);
            if (result != null) {
                var count = result.length;
                if (count > 0) {
                    var savelist = result[0].productlist + ',' + req.query.savelist;
                    console.log(result[0].productlist);
                    var items = {
                        "productlist": savelist
                    };
                    var update = db.collection('favrlist').updateOne(conditions, {
                        $set: items
                        , $currentDate: {
                            "lastModified": true
                        }
                    }, function (err, result) {
                        assert.equal(err, null);
                        res.json({
                            "status": "Success"
                            , "items": items
                        });
                    });
                }
                else {
                    var items = {
                        "usernum": req.query.saveuser
                        , "productlist": req.query.savelist
                        , "status": "1"
                    , };
                    db.collection('favrlist').insertOne(items, function (err, result) {
                        assert.equal(err, null);
                        res.json({
                            "status": "Success"
                            , 'items': items
                        });
                    });
                }
            }
            else {
                res.json({
                    "count": "0"
                });
            }
        });
    });
});
//exportlist
router.get('/exportlist', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var items = {
            "usernum": req.query.usernum
            , "productlists": req.query.productlists
            , "exporttype": req.query.exporttype
            , "recievernum": req.query.recievernum
            , "status": "1"
        , };
        db.collection('exportlists').insertOne(items, function (err, result) {
            assert.equal(err, null);
            res.json({
                "status": "Success"
                , 'items': items
            });
        });
    });
});
router.get('/importproductlist', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var conditions = {
            "usernum": req.query.usernum
            , "status": "1"
        };
        var type = req.query.modtype;
        console.log(type);
        if (type == 1) {
            db.collection('favrlist').find(conditions).toArray(function (err, result) {
                assert.equal(err, null);
                if (result != null) {
                    var hoaArray = [];
                    var inputArray = result[0].productlist.split(',');
                    var ObjectId = require('mongodb').ObjectID;
                    for (var i = 0; i < inputArray.length; i++) {
                        hoaArray.push(ObjectId(inputArray[i]));
                    }
                    //var ObjectId = require('mongodb').ObjectID;
                    var conditions = {
                        "_id": {
                            $in: hoaArray
                        }
                    };
                    db.collection('products').find(conditions).toArray(function (err, result) {
                        assert.equal(err, null);
                        console.log(result);
                        res.json({
                            "status": "success"
                            , "result": result
                            , 'cond': conditions
                        });
                    });
                }
                else {
                    var resultsempty = [];
                    res.json({
                        "status": "empty"
                        , "result": resultsempty
                        , 'cond': conditions
                    });
                }
            });
        }
        else {
            
             var conditions = {
            "usernum": req.query.usernum
            , "exporttype": type
            , "status": "1"
        };
            
            db.collection('exportlists').find(conditions).toArray(function (err, result) {
                assert.equal(err, null);
                if (result != null) {
                    var hoaArray = [];
                    var ObjectId = require('mongodb').ObjectID;
                    for (var i = 0; i < result.length; i++) {
                        var inputArray = result[i].productlists.split(',');
                    for (var j = 0; j < inputArray.length; j++) {
                        hoaArray.push(ObjectId(inputArray[j]));
                    }
                    }
                    //var ObjectId = require('mongodb').ObjectID;
                    var conditions = {
                        "_id": {
                            $in: hoaArray
                        }
                    };
                    console.log(conditions);
                    db.collection('products').find(conditions).toArray(function (err, result) {
                        assert.equal(err, null);
                        console.log(result);
                        res.json({
                            "status": "success"
                            , "result": result
                            , 'cond': conditions
                        });
                    });
                }
                else {
                    res.json({
                        "count": "0"
                    });
                }
            });
        }
    });
});

router.get('/importfriends', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
             var conditions = {
            "usernum": req.query.usernum
            , "exporttype": req.query.modtype
            , "status": "1"
        };
            
            db.collection('exportlists').aggregate(
            // Pipeline
	[
		// Stage 1
                {
                    $lookup: {
                        "from": "userdata"
                        , "localField": "usernum"
                        , "foreignField": "mobilenum"
                        , "as": "setdata"
                    }
		},

		// Stage 2
                {
                    $match: {
                        "recievernum": req.query.usernum
            , "exporttype": req.query.modtype
            , "status": "1"
                    }
		},

	]
            // Created with 3T MongoChef, the GUI for MongoDB - https://3t.io/mongochef
        ).toArray(function (err, result) {
                assert.equal(err, null);
                res.json({
                            "status": "success"
                            , "result": result
                            , 'cond': conditions
                        });
            });
       
    });
});


router.get('/importproductlisttodashboard', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);

                    var hoaArraymain = [];
                    var ObjectId = require('mongodb').ObjectID;
                    var inputArraymain = req.query.productlists.split(',');               
                    for (var j = 0; j < inputArraymain.length; j++) {
                        hoaArraymain.push(ObjectId(inputArraymain[j]));
                    }
                    
                    var conditions = {
                        "_id": {
                            $in: hoaArraymain
                        }
                        , "status": "1"
                    };
            
            db.collection('exportlists').find(conditions).toArray(function (err, result) {
                assert.equal(err, null);
                if (result != null) {
                    var hoaArray = [];
                    var ObjectId = require('mongodb').ObjectID;
                    for (var i = 0; i < result.length; i++) {
                        var inputArray = result[i].productlists.split(',');
                    for (var j = 0; j < inputArray.length; j++) {
                        hoaArray.push(ObjectId(inputArray[j]));
                    }
                    }
                    //var ObjectId = require('mongodb').ObjectID;
                    var conditions = {
                        "_id": {
                            $in: hoaArray
                        }
                    };
                    console.log(conditions);
                    db.collection('products').find(conditions).toArray(function (err, result) {
                        assert.equal(err, null);
                        console.log(result);
                        res.json({
                            "status": "success"
                            , "result": result
                            , 'cond': conditions
                        });
                    });
                }
                else {
                    res.json({
                        "count": "0"
                    });
                }
            });

    });
});


//GET home page. 
router.get('/listcategory', function (req, res, next) {

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('category').find({"status": "1"}).toArray(function (err, result) {
            assert.equal(err, null);
            console.log(result);
            res.json({
                "status": "success"
                , "result": result
            });
        });
    });
});



module.exports = router;