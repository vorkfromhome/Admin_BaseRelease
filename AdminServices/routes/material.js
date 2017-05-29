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
router.get('/creatematerial', function (req, res, next) {
    var insertDocument = function (db, callback) {};
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        autoIncrement.getNextSequence(db, 'materialmanagement', function (err, autoIndex) {
            assert.equal(err, null);
            autoid = 'MATR' + autoIndex;

            var datetime = require('node-datetime');
            var dt = datetime.create();
            var fomratted = dt.format('d-m-Y H:M:S');
            var items = {
                "name": req.query.materialname
                , "skv": autoid
                , "matericalid": autoIndex
                , "category": req.query.category
                , "defaultmetric": req.query.defaultmetric
                , "modifiedon": fomratted
                , "modifiedby": req.query.modifiedby
                , "activestatus": req.query.activestatus
                , "status": "1"
            };
            var conditions = {
                "name": req.query.materialname
                , "category": req.query.category
                , "defaultmetric": req.query.defaultmetric
                , "status": "1"
            };
            db.collection('materialmanagement').find(conditions).toArray(function (err, result) {
                assert.equal(err, null);
                var already = result.length;
                if (already == 0) {
                    db.collection('materialmanagement').insertOne(items, function (err, resultto) {
                        assert.equal(err, null);
                        res.json({
                            "status": "success"
                            , "result": resultto
                        });
                    });
                }
            });
        });
    });
});
//GET home page. 
router.get('/listmaterial', function (req, res, next) {
    var conditions = {
        "status": "1"
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('materialmanagement').find(conditions).toArray(function (err, result) {
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
router.get('/listmaterialone', function (req, res, next) {
    var ObjectId = require('mongodb').ObjectID;
    var conditions = {
        "_id": ObjectId(req.query.id)
        , "status": "1"
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('materialmanagement').find(conditions).toArray(function (err, result) {
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
router.get('/updatematerial', function (req, res, next) {
    var datetime = require('node-datetime');
    var dt = datetime.create();
    var fomratted = dt.format('d-m-Y H:M:S');
    var items = {
        "name": req.query.materialname
        , "category": req.query.category
        , "defaultmetric": req.query.defaultmetric
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
        , "name": req.query.materialname
        , "category": req.query.category
        , "defaultmetric": req.query.defaultmetric
        , "status": "1"
    }
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('materialmanagement').find(conditionscheck).toArray(function (err, result) {
            assert.equal(err, null);
            var already = result.length;
            if (already == 0) {
                db.collection('materialmanagement').updateOne(conditions, {
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
router.get('/deletematerial', function (req, res, next) {
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
        db.collection('materialmanagement').updateOne(conditions, {
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
router.get('/bulkcreatematerial', function (req, res, next) {
    
    var bulkdata = req.query.bulkdata;
    var parsed = JSON.parse(bulkdata);

    var activestatusarray = [];    
    activestatusarray["Active"]="1";
    activestatusarray["In Active"]="0";
    activestatusarray["Deleted"]="-1";

    var arr = [];
    for (var x in parsed) {
        arr.push(parsed[x]);
    }
    //  console.log(arr.length);
    var datetime = require('node-datetime');
    var dt = datetime.create();
    var fomratted = dt.format('d-m-Y H:M:S');

    arr.forEach(function (element, index, array) {
    if(typeof element.name!== 'undefined' && typeof element.category!== 'undefined' && typeof element.defaultmetric!== 'undefined' && typeof element.modifiedby!== 'undefined' && typeof element.activestatus!== 'undefined') {
    if(element.name!="" && element.category!="" && element.defaultmetric!="" && element.modifiedby!="" && element.activestatus!="") {
    
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            autoIncrement.getNextSequence(db, 'materialmanagement', function (err, autoIndex) {
                assert.equal(err, null);
                autoid = 'MATR' + autoIndex;

                var items = {
                    "name": element.name
                    , "skv": autoid
                    , "matericalid": autoIndex
                    , "category": element.category
                    , "defaultmetric": element.defaultmetric
                    , "modifiedon": fomratted
                    , "modifiedby": element.modifiedby
                    , "activestatus": activestatusarray[element.activestatus]
                    , "status": "1"
                };
                var conditions = {
                    "name": element.name
                    , "category": element.category
                    , "defaultmetric": element.defaultmetric
                    , "status": "1"
                };
                db.collection('materialmanagement').find(conditions).toArray(function (err, result) {
                    assert.equal(err, null);
                    var already = result.length;
                    if (already == 0) {
                        db.collection('materialmanagement').insertOne(items, function (err, result) {
                            assert.equal(err, null);
                        });
                    }
                });
            });
        });
}   }
    });
 res.json({
        "status": "success"
    });
});
router.get('/bulkupdatematerial', function (req, res, next) {
    
    var bulkdata = req.query.bulkdata;
    var parsed = JSON.parse(bulkdata);

    var activestatusarray = [];    
    activestatusarray["Active"]="1";
    activestatusarray["In Active"]="0";
    activestatusarray["Deleted"]="-1";

    var arr = [];
    for (var x in parsed) {
        arr.push(parsed[x]);
    }
    //  console.log(arr.length);
    var datetime = require('node-datetime');
    var dt = datetime.create();
    var fomratted = dt.format('d-m-Y H:M:S');

    arr.forEach(function (element, index, array) {
    if(typeof element.name!== 'undefined' && typeof element.category!== 'undefined' && typeof element.defaultmetric!== 'undefined' && typeof element.modifiedby!== 'undefined' && typeof element.activestatus!== 'undefined') {
    if(element.name!="" && element.category!="" && element.defaultmetric!="" && element.modifiedby!="" && element.activestatus!="") {
        
        var ObjectId = require('mongodb').ObjectID;
        var conditions = {
            "_id": ObjectId(element._id)
        }

        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
        var conditionscheck = {
            "_id": {
                $ne: ObjectId(element._id)
            }
            , "name": element.name
            , "category": element.category
            , "defaultmetric": element.defaultmetric
            , "status": "1"
        }
        var items = {
            "name": element.name
            , "category": element.category
            , "defaultmetric": element.defaultmetric
            , "modifiedon": fomratted
            , "modifiedby": element.modifiedby
            , "activestatus": activestatusarray[element.activestatus]
        };
            db.collection('materialmanagement').find(conditionscheck).toArray(function (err, result) {
                assert.equal(err, null);
                var already = result.length;
                if (already == 0) {
                    db.collection('materialmanagement').updateOne(conditions, {
                        $set: items
                        , $currentDate: {
                            "lastModified": true
                        }
                    }, function (err, result) {
                        assert.equal(err, null);
                    });
                }
            });
        });
} }
    });
 res.json({
        "status": "success"
    });
});
module.exports = router;