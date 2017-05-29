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
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with dddd a resource');
});
//catagory...
/* GET home page. */
router.get('/createclient', function (req, res, next) {
    var insertDocument = function (db, callback) {

        var datetime = require('node-datetime');
        var dt = datetime.create();
        var fomratted = dt.format('d-m-Y H:M:S');
         autoIncrement.getNextSequence(db, 'clientmanagement', function (err, autoIndex) {
            assert.equal(err, null);
               
            var items = {
                "firstname": req.query.firstname
                ,"lastname": req.query.lastname
                , "userid": autoIndex
                , "mobile": req.query.mobile
                , "email": req.query.email
                , "password": req.query.password
                , "pin": req.query.pin
                , "modifiedon": fomratted
                , "modifiedby": req.query.modifiedby
                , "activestatus": req.query.activestatus
                , "status": "1"
            };
            var conditions = {
                "firstname": req.query.firstname
                ,"lastname": req.query.lastname
                , "mobile": req.query.mobile
                , "email": req.query.email
                , "password": req.query.password
                , "pin": req.query.pin
                , "status": "1"
            };
            db.collection('clientmanagement').find(conditions).toArray(function (err, result) {
                assert.equal(err, null);
                var already = result.length;
                if (already == 0) {
                    db.collection('clientmanagement').insertOne(items, function (err, result) {
                        assert.equal(err, null);
                        res.json({
                            "status": "Success"
                            , 'items': items
                        });
                        callback();
                    });
                }
            });
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
router.get('/listclient', function (req, res, next) {
    var conditions = {
        "status": "1"
    };
    var items = {
        "pin": 0
        ,"password": 0
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('clientmanagement').find(conditions,items).toArray(function (err, result) {
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
router.get('/listclientone', function (req, res, next) {
    var ObjectId = require('mongodb').ObjectID;
    var conditions = {
        "_id": ObjectId(req.query.id)
        , "status": "1"
    };
        var items = {
        "pin": 0
        ,"password": 0
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('clientmanagement').find(conditions,items).toArray(function (err, result) {
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
/* GET home page. */
router.get('/updateclient', function (req, res, next) {
    var datetime = require('node-datetime');
    var dt = datetime.create();
    var fomratted = dt.format('d-m-Y H:M:S');
    var items = {
                "firstname": req.query.firstname
                ,"lastname": req.query.lastname
                , "mobile": req.query.mobile
                , "email": req.query.email
                , "modifiedon": fomratted
                , "modifiedby": req.query.modifiedby
                , "activestatus": req.query.activestatus
            };
    var ObjectId = require('mongodb').ObjectID;
    var conditions = {
        "_id": ObjectId(req.query.id)
    }
    var conditionscheck = {
        "_id": {
            $ne: ObjectId(req.query.id)
        }
        , "firstname": req.query.firstname
                ,"lastname": req.query.lastname
                , "mobile": req.query.mobile
                , "email": req.query.email
                , "password": req.query.password
                , "pin": req.query.pin
        , "status": "1"
    }
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('clientmanagement').find(conditionscheck).toArray(function (err, result) {
            assert.equal(err, null);
            var already = result.length;
            if (already == 0) {
                db.collection('clientmanagement').updateOne(conditions, {
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
            }
        });
    });
});
/* GET home page. */
router.get('/deleteclient', function (req, res, next) {
    var datetime = require('node-datetime');
    var dt = datetime.create();
    var fomratted = dt.format('d-m-Y H:M:S');
    var items = {
        "status": req.query.status
        , "modifiedon": fomratted
        , "modifiedby": req.query.modifiedby
    };
    var ObjectId = require('mongodb').ObjectID;
    var conditions = {
        "_id": ObjectId(req.query.id)
    }
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('clientmanagement').updateOne(conditions, {
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
router.get('/resetclient', function (req, res, next) {
    var datetime = require('node-datetime');
    var dt = datetime.create();
    var fomratted = dt.format('d-m-Y H:M:S');
    var items = {
        "activestatus": "2"
        , "modifiedon": fomratted
        , "modifiedby": req.query.modifiedby
    };
    var ObjectId = require('mongodb').ObjectID;
    var conditions = {
        "_id": ObjectId(req.query.id)
    }
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('clientmanagement').updateOne(conditions, {
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
module.exports = router;