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
router.get('/createattribute', function (req, res, next) {

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
    autoIncrement.getNextSequence(db, 'attributemanagement', function (err, autoIndex) {

            assert.equal(err, null);

            var datetime = require('node-datetime');
            var dt = datetime.create();
            var fomratted = dt.format('d-m-Y H:M:S');
            var items = {
                "attributegrandparent": req.query.attributegrandparent
                , "attributeparent": req.query.attributeparent
                , "attributerole": req.query.attributerole
                , "attributeroleid": autoIndex
                , "modifiedon": fomratted
                , "modifiedby": req.query.modifiedby
                , "activestatus": req.query.activestatus
                , "status": "1"
            };
            var conditions = {
                "attributegrandparent": req.query.attributegrandparent
                , "attributeparent": req.query.attributeparent
                , "attributerole": req.query.attributerole
                , "status": "1"
            };
            db.collection('attributemanagement').find(conditions).toArray(function (err, result) {
                assert.equal(err, null);
                var already = result.length;
                if (already == 0) {
                    db.collection('attributemanagement').insertOne(items, function (err, result) {
                        assert.equal(err, null);
                        res.json({
                            "status": "Success"
                            , 'items': items
                        });
                    });
                }
            });
    });
});
});
//GET home page. 
router.get('/listattribute', function (req, res, next) {
    var conditions = {
        "status": "1"
        , "attributegrandparent": req.query.attributegrandparent
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('attributemanagement').find(conditions).toArray(function (err, result) {
            assert.equal(err, null);
            //console.log(result);
            res.json({
                "status": "success"
                , "result": result
                , 'cond': conditions
            });
        });
    });
});
//GET home page. 
router.get('/listattributeroles', function (req, res, next) {
    var conditions = {
        "status": "1"
    };
    var items = {
        "attributeroleid": 1
        , "attributerole": 1
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('attributemanagement').find(conditions,items).toArray(function (err, result) {
            assert.equal(err, null);
            //console.log(result);
            res.json({
                "status": "success"
                , "result": result
                , 'cond': conditions
            });
        });
    });
});
//GET home page. 
router.get('/listattributeone', function (req, res, next) {
    var ObjectId = require('mongodb').ObjectID;
    var conditions = {
        "_id": ObjectId(req.query.id)
        , "status": "1"
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('attributemanagement').find(conditions).toArray(function (err, result) {
            assert.equal(err, null);
            //console.log(result);
            res.json({
                "status": "success"
                , "result": result
                , 'cond': conditions
            });
        });
    });
});
/* GET home page. */
router.get('/updateattribute', function (req, res, next) {
    var datetime = require('node-datetime');
    var dt = datetime.create();
    var fomratted = dt.format('d-m-Y H:M:S');
    var items = {
        "attributegrandparent": req.query.attributegrandparent
        , "attributeparent": req.query.attributeparent
        , "attributerole": req.query.attributerole
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
        , "attributegrandparent": req.query.attributegrandparent
        , "attributeparent": req.query.attributeparent
        , "attributerole": req.query.attributerole
    }
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('attributemanagement').find(conditionscheck).toArray(function (err, result) {
            assert.equal(err, null);
            //console.log(result);
            var already = result.length;
            if (already == 0) {
                db.collection('attributemanagement').updateOne(conditions, {
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
router.get('/deleteattribute', function (req, res, next) {
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
    };
    //console.log(items);
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('attributemanagement').updateOne(conditions, {
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
//mainrole
router.get('/mainrole', function (req, res, next) {
    var conditions = {
        "attributegrandparent": "0"
        , "attributeparent": "0"
        , "status": "1"
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('attributemanagement').find(conditions).toArray(function (err, result) {
            assert.equal(err, null);
            //console.log(result);
            res.json({
                "status": "success"
                , "result": result
                , 'cond': conditions
            });
        });
    });
});
//subrole
router.get('/subrole', function (req, res, next) {
    var conditions = {
        "attributegrandparent": {
            $ne: "0"
        }
        , "attributeparent": "0"
        , "status": "1"
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('attributemanagement').find(conditions).toArray(function (err, result) {
            assert.equal(err, null);
            //console.log(result);
            res.json({
                "status": "success"
                , "result": result
                , 'cond': conditions
            });
        });
    });
});
/* GET home page. */
router.get('/bulkcreateattribute', function (req, res, next) {
    
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

    var totconditions = {};
    var totitems = {
      "attributeroleid": 1
    , "attributerole": 1
    };

    var errorrow = "";
    arr.forEach(function (element, index, array) {
    var errcount = 0;
        console.log(element.attributegrandparent);
       if(typeof element.attributegrandparent!== 'undefined' && typeof element.attributeparent!== 'undefined' && typeof element.attributerole!== 'undefined' && typeof element.modifiedby!== 'undefined' && typeof element.activestatus!== 'undefined') {
       if(element.attributegrandparent!="" && element.attributeparent!="" && element.attributerole!="" && element.modifiedby!="" && element.activestatus!="") {
        MongoClient.connect(url, function (err, db) { 
            autoIncrement.getNextSequence(db, 'attributemanagement', function (err, autoIndex) {
            assert.equal(err, null);
            db.collection('attributemanagement').find(totconditions,totitems).toArray(function (err, result) {
                assert.equal(err, null);

                var rolesname = [];
                rolesname["not"] = "0";
                result.forEach(function (element, index, array) {
                    rolesname[element.attributerole] = element.attributeroleid;
                });
                
                var items = {
                    "attributegrandparent": rolesname[element.attributegrandparent]
                    , "attributeparent": rolesname[element.attributeparent]
                    , "attributerole": element.attributerole
                    , "attributeroleid": autoIndex
                    , "modifiedon": fomratted
                    , "modifiedby": element.modifiedby
                    , "activestatus": activestatusarray[element.activestatus]
                    , "status": "1"
                };
                var conditions = {
                    "attributegrandparent": rolesname[element.attributegrandparent]
                    , "attributeparent": rolesname[element.attributeparent]
                    , "attributerole": element.attributerole
                    , "status": "1"
                };
                db.collection('attributemanagement').find(conditions).toArray(function (err, result) {
                    assert.equal(err, null);
                    var already = result.length;
                    if (already == 0) {
                        db.collection('attributemanagement').insertOne(items, function (err, result) {
                            assert.equal(err, null);
                            console.log("enter1");
                            errcount = 1;
                        });
                    }
                });
                
            });
         });
        });
} }
if(errcount==0){
        var row = index+1;
        errorrow +=row+","
    }
    });

res.json({
                "status": "success"
                , "result": errorrow.slice(0,-1)
            });
});
/* GET home page. */
router.get('/bulkupdateattribute', function (req, res, next) {
    
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

    var totconditions = {};
    var totitems = {
      "attributeroleid": 1
    , "attributerole": 1
    };

    var errorrow = "";
    arr.forEach(function (element, index, array) {
    var errcount = 0; 
    if(typeof element._id!=="undefined" && typeof element.attributegrandparent!== 'undefined' && typeof element.attributeparent!== 'undefined' && typeof element.attributerole!== 'undefined' && typeof element.modifiedby!== 'undefined' && typeof element.activestatus!== 'undefined') {
    if(element._id!="" && element.attributegrandparent!="" && element.attributeparent!="" && element.attributerole!="" && element.modifiedby!="" && element.activestatus!="") {
        
        var ObjectId = require('mongodb').ObjectID;
        var conditions = {
            "_id": ObjectId(element._id)
        }
        
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
        db.collection('attributemanagement').find(totconditions,totitems).toArray(function (err, result) {
        assert.equal(err, null);

        var rolesname = [];
                rolesname["not"] = "0";
                result.forEach(function (element, index, array) {
                    rolesname[element.attributerole] = element.attributeroleid;
                });

        if(rolesname[element.attributegrandparent]!=null && rolesname[element.attributeparent]!=null && activestatusarray[element.activestatus]!=null){
        var items = {
            "attributegrandparent": rolesname[element.attributegrandparent]
            , "attributeparent": rolesname[element.attributeparent]
            , "attributerole": element.attributerole
            , "modifiedon": fomratted
            , "modifiedby": element.modifiedby
            , "activestatus": activestatusarray[element.activestatus]
        };
        var conditionscheck = {
            "_id": {
                $ne: ObjectId(element._id)
            }
            , "attributegrandparent": rolesname[element.attributegrandparent]
            , "attributeparent": rolesname[element.attributeparent]
            , "attributerole": element.attributerole
            , "status": "1"
        }

        db.collection('attributemanagement').find(conditionscheck).toArray(function (err, result) {
                assert.equal(err, null);
                var already = result.length;
                if (already == 0) {
                    db.collection('attributemanagement').updateOne(conditions, {
                        $set: items
                        , $currentDate: {
                            "lastModified": true
                        }
                    }, function (err, result) {
                        assert.equal(err, null);
                        errcount=1;
                    });
                }
            });
    }
         });
        });
    } }
    if(errcount==0){
        var row = index+1;
        errorrow +=row+","
    }
    });
res.json({
                "status": "success"
                , "result": errorrow.slice(0,-1)
            });
});
module.exports = router;