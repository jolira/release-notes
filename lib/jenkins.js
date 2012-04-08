var rest = require('restler');

var url;

function init(options) {
	url = options.url;
}

function jobs(cb) {
	call(constructUrl(), function(result) {
		cb(result.jobs);
	});
}
	
function builds(job, cb) {
	call(constructUrl('/job/' + job), function(result) {
		cb(result.builds);
	});
}

function build(job, build, cb) {
	call(constructUrl('/job/' + job + '/' + build), function(result) {
		cb(result);
	})
}

function constructUrl(path, params) {
	return url + (path?path:'');
}

function call(url, cb) {
	rest.get(url + '/api/json', {parser: rest.parsers.json }).on('complete', function(result) { cb(result) });
}

exports.init = init;
exports.jobs = jobs;
exports.builds = builds;
exports.build = build;