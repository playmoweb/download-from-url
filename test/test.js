// TODO

var downloader = require("./index.js");

downloader("https://dashboard.buddybuild.com/api/download/download-apk?buildID=57ee12c00042bf01007ae78a&application_variant=debug", "./", function(err, infos, headers) {
	console.log(err);
	console.log(infos);
	console.log(result);
});