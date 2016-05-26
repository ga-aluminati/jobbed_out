var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var mongoosePaginate = require('mongoose-paginate');

var JobSchema = new mongoose.Schema({
    link: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, required: true }
});

JobSchema.plugin(timestamps);
JobSchema.plugin(mongoosePaginate);

var Job = mongoose.model('Job', JobSchema);

module.exports = Job;
