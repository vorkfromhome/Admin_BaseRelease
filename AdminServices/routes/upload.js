var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/mydb';
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//const csv=require('csvtojson');
var app = express();
/* GET home page. */
router.post('/attributebulkinsert', function (req, res, next) {
    console.log(req.files); // the uploaded file object 
    if (!req.files) return res.status(400).send('No files were uploaded.');
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
    let sampleFile = req.files.file;
    // Use the mv() method to place the file somewhere on your server 
    sampleFile.mv('./uploads/attributeinsertdatabulk.csv', function (err) {
        if (err) return res.status(500).send(err);
        //Converter Class
        var Converter = require("csvtojson").Converter;
        var fs = require("fs");
        //CSV File Path or CSV String or Readable Stream Object
        var csvFileName = './uploads/attributeinsertdatabulk.csv';
        //new converter instance
        var csvConverter = new Converter({});
        //end_parsed will be emitted once parsing finished
        csvConverter.on("end_parsed", function (jsonObj) {
            //console.log(jsonObj); //here is your result json object
            res.json({
                "status": "success"
                , "result": jsonObj
            });
        });
        //read from file
        fs.createReadStream(csvFileName).pipe(csvConverter);
    });
});




router.post('/materialbulkinsert', function (req, res, next) {
    console.log(req.files); // the uploaded file object 
    if (!req.files) return res.status(400).send('No files were uploaded.');
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
    let sampleFile = req.files.file;
    // Use the mv() method to place the file somewhere on your server 
    sampleFile.mv('./uploads/materialinsertdatabulk.csv', function (err) {
        if (err) return res.status(500).send(err);
        //Converter Class
        var Converter = require("csvtojson").Converter;
        var fs = require("fs");
        //CSV File Path or CSV String or Readable Stream Object
        var csvFileName = './uploads/materialinsertdatabulk.csv';
        //new converter instance
        var csvConverter = new Converter({});
        //end_parsed will be emitted once parsing finished
        csvConverter.on("end_parsed", function (jsonObj) {
            console.log(jsonObj); //here is your result json object
            res.json({
                "status": "success"
                , "result": jsonObj
            });
        });
        //read from file
        fs.createReadStream(csvFileName).pipe(csvConverter);
    });
});


router.post('/materialbulkupdate', function (req, res, next) {
    console.log(req.files); // the uploaded file object 
    if (!req.files) return res.status(400).send('No files were uploaded.');
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
    let sampleFile = req.files.file;
    // Use the mv() method to place the file somewhere on your server 
    sampleFile.mv('./uploads/materialupdatedatabulk.csv', function (err) {
        if (err) return res.status(500).send(err);
        //Converter Class
        var Converter = require("csvtojson").Converter;
        var fs = require("fs");
        //CSV File Path or CSV String or Readable Stream Object
        var csvFileName = './uploads/materialupdatedatabulk.csv';
        //new converter instance
        var csvConverter = new Converter({});
        //end_parsed will be emitted once parsing finished
        csvConverter.on("end_parsed", function (jsonObj) {
            console.log(jsonObj); //here is your result json object
            res.json({
                "status": "success"
                , "result": jsonObj
            });
        });
        //read from file
        fs.createReadStream(csvFileName).pipe(csvConverter);
    });
});





router.post('/attributebulkupdate', function (req, res, next) {
    console.log(req.files); // the uploaded file object 
    if (!req.files) return res.status(400).send('No files were uploaded.');
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
    let sampleFile = req.files.file;
    // Use the mv() method to place the file somewhere on your server 
    sampleFile.mv('./uploads/attributeupdatedatabulk.csv', function (err) {
        if (err) return res.status(500).send(err);
        //Converter Class
        var Converter = require("csvtojson").Converter;
        var fs = require("fs");
        //CSV File Path or CSV String or Readable Stream Object
        var csvFileName = './uploads/attributeupdatedatabulk.csv';
        //new converter instance
        var csvConverter = new Converter({});
        //end_parsed will be emitted once parsing finished
        csvConverter.on("end_parsed", function (jsonObj) {
            console.log(jsonObj); //here is your result json object
            res.json({
                "status": "success"
                , "result": jsonObj
            });
        });
        //read from file
        fs.createReadStream(csvFileName).pipe(csvConverter);
    });
});

module.exports = router;