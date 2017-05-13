var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var express = require('express');
var app = express();

module.exports.attachSrt = function(pathToDir, name, vidExtension, writePath) {
    return new Promise((resolve, reject) => {
        var subtitleOption = '-vf subtitles=' + pathToDir + name + ".srt";
        ffmpeg(pathToDir + name + vidExtension)
            .outputOptions(subtitleOption)
            .on('error', function(err) {
                reject(err);
            })
            .save(writePath + name + vidExtension)
            .on('end', function() {
                console.log("finished attaching srt posting vid now");
                resolve((writePath + name + vidExtension));
            })
    })
}


module.exports.extractAudio = (pathToVid, name, extension) => {
    return new Promise((resolve, reject) => {
        var proc = new ffmpeg({source:(pathToVid + name + extension)})
            .toFormat('wav')
            .save(pathToVid + name + ".wav")
            .on('error', (err) => {
                reject(err)
            })
            .on('end', () => {
                resolve();
            })
    })
}


// module.exports.streaming = function(req, res, newpath) {
//     var path = './' + newpath + '.mp4';
//     var stat = fs.statSync(path);
//     var total = stat.size;
//     if (req.headers['range']) {
//         var range = req.headers.range;
//         var parts = range.replace(/bytes=/, "").split("-");
//         var partialstart = parts[0];
//         var partialend = parts[1];
//
//         var start = parseInt(partialstart, 10);
//         var end = partialend ? parseInt(partialend, 10) : total - 1;
//         var chunksize = (end - start) + 1;
//         console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);
//
//         var file = fs.createReadStream(path, {
//             start: start,
//             end: end
//         });
//         res.writeHead(206, {
//             'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
//             'Accept-Ranges': 'bytes',
//             'Content-Length': chunksize,
//             'Content-Type': 'video/mp4'
//         });
//         file.pipe(res);
//     } else {
//         console.log('ALL: ' + total);
//         res.writeHead(200, {
//             'Content-Length': total,
//             'Content-Type': 'video/mp4'
//         });
//         fs.createReadStream(path).pipe(res);
//     }
// }




//https://trac.ffmpeg.org/wiki/CompilationGuide/MacOSX
//brew install ffmpeg --with-fdk-aac --with-ffplay --with-freetype --with-libass --with-libquvi --with-libvorbis --with-libvpx --with-opus --with-x265



// var uuid = require('node-uuid');
// var port = 8000;


// module.exports.addSubtitles = function(key, callback) {
//     console.log("inside addSubtitles: " + __dirname + '/../slack/slack_downloads/obama.mp4');
//     var subtitleOption = '-vf subtitles=' +  __dirname + '/../slack/slack_downloads/obama.srt'
//     console.log("subtitleoption: " + subtitleOption);
//     ffmpeg(__dirname + '/../slack/slack_downloads/obama.mp4')
//         .outputOptions(
//             subtitleOption
//         )
//         .on('error', function(err) {
//             console.log("lol err as expected: " + err);
//             callback(true, err)
//         })
//         .save(__dirname + '/../public/slack_uploads/obama.mp4')
//         .on('end', function() {
//             console.log("done in end without err");
//             callback(false, "done");
//         })
// }




//
// app.get('/subs', function(req, res) {
//     addSubtitles("movie", function(error, newpath) {
//         if (error) {
//             res.send("error : " + error)
//         } else {
//             console.log("done");
//             res.end();
//         }
//     })
// })
//
//
// app.get('/', function(req, res) {
//     streaming(req, res, "moviewithsubtitle");
// })
//
// app.listen(port);
// console.log("the server is running at port :", port);
