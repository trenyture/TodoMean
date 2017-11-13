

// GET /api/tasks -> All tasks
// GET /api/tasks/:id -> Return tash id
// PUT /api/tasks/:id -> Modifie
// POST /api/tasks -> Créer 
// DELETE /api/tasks/:id -> Supprimer une task

// mongodb://192.168.8.2:27017/test-simon

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var express = require('express');
var router = express.Router();
var db;
MongoClient.connect('mongodb://192.168.8.2:27017/test-simon' , function(err, database){ db = database; });

/* GET home page. */
router.get('/', function(req, res, next) {
	db.collection('tasks').find().toArray(function(err, docs) {
		if (!err) {
			res.json(docs)
		} else{
			res.status(500).send('Fail dans la requete NoMYSQL : ' + err);
		}
    });
});

router.get('/:id', function(req, res, next) {
	db.collection('tasks').find({ _id : req.params.id }).limit(1).next(function(err, docs) {
		if (!err) {
			res.json(docs)
		} else{
			res.status(500).send('Fail dans la requete NoMYSQL');
		}
    });
});

router.post('/', function(req, res, next) {
	if (req.body.todo && req.body.status){
		datas = {
			"_id": Math.random().toString(36).slice(2, 8),
			name: req.body.todo,
			status: req.body.status
		};
		db.collection('tasks').insertOne(datas, function(err, r) {
			if (!err) {
				res.status(200).send(true);
			} else {
				res.status(500).send('Fail dans la requete NoMYSQL');		
			}
		});
	}else{
		res.status(500).send('Vous devez remplir tous les champs!');
	}
});

router.put('/:id', function(req, res, next) {
	if (req.params.id && req.body.status){
		db.collection('tasks').updateOne({_id:req.params.id}, { $set: {status: req.body.status} }, function(err, doc) {
			console.log(err);
			if (!err) {
				res.status(200).send(true);
			} else {
				res.status(500).send('Fail dans la requete NoMYSQL');
			}
		});
	}else{
		res.status(500).send('Vous devez renseigner tous les champs');
	}
});

router.delete('/:id', function(req, res, next) {
	if (req.params.id){
		db.collection('tasks').deleteOne({_id:req.params.id}, {status: req.body.status}, function(err, doc) {
			if (!err){
				res.status(200).send(true);
			} else {
				res.status(500).send('Fail dans la requete NoMYSQL');
			}
		});
	}else{
		res.send(false);
	}
});


module.exports = router;
