// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var app = express();

var options = {};
if (process.env.PARSE_SERVER_OPTIONS) {

	options = JSON.parse(process.env.PARSE_SERVER_OPTIONS);

} else {

	options.databaseURI = process.env.PARSE_SERVER_DATABASE_URI;
	options.cloud = process.env.PARSE_SERVER_CLOUD_CODE_MAIN || __dirname + '/cloud/main.js';
	options.collectionPrefix = process.env.PARSE_SERVER_COLLECTION_PREFIX;
  options.port = process.env.PORT || 1337;
  options.mountPath = process.env.PARSE_SERVER_MOUNT_PATH || "/parse"
  options.serverURL = 'http://localhost:'+ options.port + options.mountPath

	// Keys and App ID
	options.appId = process.env.PARSE_SERVER_APPLICATION_ID;
	options.clientKey = process.env.PARSE_SERVER_CLIENT_KEY;
	options.restAPIKey = process.env.PARSE_SERVER_REST_API_KEY;
	options.dotNetKey = process.env.PARSE_SERVER_DOTNET_KEY;
	options.javascriptKey = process.env.PARSE_SERVER_JAVASCRIPT_KEY;
	options.dotNetKey = process.env.PARSE_SERVER_DOTNET_KEY;
	options.masterKey = process.env.PARSE_SERVER_MASTER_KEY;
	options.fileKey = process.env.PARSE_SERVER_FILE_KEY;
	// Comma separated list of facebook app ids
	var facebookAppIds = process.env.PARSE_SERVER_FACEBOOK_APP_IDS;

	if (facebookAppIds) {
		facebookAppIds = facebookAppIds.split(",");
		options.facebookAppIds = facebookAppIds;
	}
}
console.log('xxxxxxxxx');
var mountPath = process.env.PARSE_SERVER_MOUNT_PATH || "/parse";
var api = new ParseServer(options);
app.use(mountPath, api);

var port = process.env.PORT || 1337;
app.listen(port, function() {
  console.log('parse-server-example running on http://localhost:'+ port + mountPath);
});

job.start();
