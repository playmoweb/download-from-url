'use strict';
var fs = require('fs');
var request = require('request');
var through2 = require('through2');

const filenameRegex = /(filename=|filename\*='')"(.*)"$/;


/**
 * Parse headers to extract filename and contentType
 */
function parseFileHeaders(headers, cb) {
    var match = headers['content-disposition'] && headers['content-disposition'].match(filenameRegex);

    cb(null, {
        filename: (match && match[2]) ? match[2] : "unknow-file-name",
        contentType: headers["content-type"] || "unknow-content-type"
    });
}

/**
 * Get a file from an url
 * @param   url                 URL to a file
 * @param   outputPath          Path where you want to copy the file
 * @param   cb                  Callback (error, infos, headers)
 */
module.exports = (url, outputPath, cb) => {
    var req = request(url);

    if(typeof outputPath === 'function') {
        cb = outputPath;
        outputPath = "./";
    }
    else if(outputPath[outputPath.length-1] !== "/")
        outputPath = outputPath + "/";

    req.on('error', function (e) {
        return cb(e);
    });

    req.on('response', function (res) {
        if (res.statusCode !== 200)
            return cb(new Error("Server responded with error code : " + res.statusCode));
        
        try {
            parseFileHeaders(res.headers, function(err, headers) {
                if(err) throw err;

                var fullPath = outputPath + headers.filename;
                var ws = fs.createWriteStream(fullPath /*, default options */);

                ws.on('error', function (e) {
                    throw e;
                });

                ws.on('finish', function () {
                    return cb(null, {fullpath : fullPath, filename: headers.filename, contentType: headers.contentType}, res.headers);
                });

                req.pipe(through2(function (chunk, enc, callback) {
                    this.push(chunk);
                    return callback();
                })).pipe(ws);
            });               
        } 
        catch (e) {
            console.log(e);
        }
    });
};