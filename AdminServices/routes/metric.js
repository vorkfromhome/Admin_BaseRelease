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
router.get('/createmetric', function (req, res, next) {
    var insertDocument = function (db, callback) {
        var datetime = require('node-datetime');
        var dt = datetime.create();
        var fomratted = dt.format('d-m-Y H:M:S');
       autoIncrement.getNextSequence(db, 'clientmanagement', function (err, autoIndex) {
            assert.equal(err, null);
            var items = {
                "name": req.query.name
                , "metricid": autoIndex
                , "symbol": req.query.symbol
                , "baseunit": req.query.baseunit
                , "multiple": req.query.multiple
                , "modifiedon": fomratted
                , "modifiedby": req.query.modifiedby
                , "activestatus": req.query.activestatus
                , "status": "1"
            };
            var conditions = {
                "name": req.query.name
                , "symbol": req.query.symbol
                , "baseunit": req.query.baseunit
                , "multiple": req.query.multiple
                , "status": "1"
            };
            db.collection('metricmanagement').find(conditions).toArray(function (err, result) {
                assert.equal(err, null);
                var already = result.length;
                if (already == 0) {
                    db.collection('metricmanagement').insertOne(items, function (err, result) {
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
router.get('/listmetric', function (req, res, next) {
    var conditions = {
        "status": "1"
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('metricmanagement').find(conditions).toArray(function (err, result) {
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
router.get('/listmetricone', function (req, res, next) {
    var ObjectId = require('mongodb').ObjectID;
    var conditions = {
        "_id": ObjectId(req.query.id)
        , "status": "1"
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('metricmanagement').find(conditions).toArray(function (err, result) {
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
router.get('/updatemetric', function (req, res, next) {
    var datetime = require('node-datetime');
    var dt = datetime.create();
    var fomratted = dt.format('d-m-Y H:M:S');
    var items = {
        "name": req.query.name
        , "symbol": req.query.symbol
        , "baseunit": req.query.baseunit
        , "multiple": req.query.multiple
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
        , "name": req.query.name
        , "symbol": req.query.symbol
        , "baseunit": req.query.baseunit
        , "multiple": req.query.multiple
        , "status": "1"
    }
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('metricmanagement').find(conditionscheck).toArray(function (err, result) {
            assert.equal(err, null);
            var already = result.length;
            if (already == 0) {
                db.collection('metricmanagement').updateOne(conditions, {
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
router.get('/deletemetric', function (req, res, next) {
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
        db.collection('metricmanagement').updateOne(conditions, {
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