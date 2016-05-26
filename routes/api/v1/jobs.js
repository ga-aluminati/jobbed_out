var express = require('express');
var router = express.Router();
var Job = require('../../../models/job');
var _ = require('underscore');

// Index route
router.get('/', function(req, res, next) {

  var filtered = _.pick({
    title: new RegExp(req.query.title, "i"),
    company: new RegExp(req.query.company, "i")
  }, _.identity);

  var sort = _.pick({
    createdAt: req.query.sort === 'createdAt' ? 'ascending' : null,
    title: req.query.sort === 'title' ? 'ascending' : null,
    company: req.query.sort === 'company' ? 'ascending' : null
  }, _.identity);

  var pagination = {
    page: req.query.page || 1,
    limit: 5,
    sort: sort
  };

  Job.paginate(filtered, pagination, function(err, jobs) {
    if (err) {
      console.log(err);
      throw err;
    }

    res.status(200).json(jobs);
  });

});

// Show route
router.get('/:id', function(req, res, next) {

  Job.findOne({ _id: req.params.id }, function(err, job) {
    if (err) {
      console.log(err);
      throw err;
    }

    res.status(200).json(job);
  });

});

// Create route
router.post('/', function(req, res, next) {

  var job = new Job(req.body.job);

  job.save(function(err, job) {
    if (err) {
      console.log(err);
      throw err;
    }

    res.status(200).json(job);
  });

});

// Update route
router.put('/:id', function(req, res, next) {

  Job.findByIdAndUpdate(req.params.id, req.body.job, function(err, job) {
    if (err) {
      console.log(err);
      throw err;
    }

    res.status(200).json(job);
  });

});

// Delete route
router.delete('/:id', function(req, res, next) {

  Job.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
      throw err;
    }

    res.status(200).json({});
  });

});

module.exports = router;
