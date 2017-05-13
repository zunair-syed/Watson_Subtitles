"use strict";
let http = require('http')
let https = require('https')
let fs = require('fs')

module.exports.getAPI = (url, callback) => {
    https.get(url, (res) => {
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
            try {
                console.log("rawData: " + rawData);
                let parsedData = JSON.parse(rawData);
                return callback(parsedData);
            } catch (e) {
                console.log(e.message);
            }
        });
    });
}

module.exports.getAPI = (url, headers, callback) => {
    if(!headers){headers = {accept: 'application/json'}}
    else{headers.accept = 'application/json'}

    var request = require('request');
    var options = {
      url: url,
      headers: headers
    };

    request(options, (err, response, body) => {
        console.log("err: " + err);
        console.log("response: " + response);
        console.log("body: " + body);

        callback(err, response, body);
    })
}

module.exports.getAndSaveFile = (url, headers, name, callback) => {
    if(!headers){headers = {accept: 'application/json'}}
    else{headers.accept = 'application/json'}

    var request = require('request');
    var options = {
      url: url,
      headers: headers
    };

    var fileStream = fs.createWriteStream(name);
    fileStream.on('close', function() {
      console.log('file written done');
      callback();
    });
    
    request(options).pipe(fileStream)
}



module.exports.getFilesizeInBytes = (filename) => {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
}

module.exports.isJson = (item) => {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}
