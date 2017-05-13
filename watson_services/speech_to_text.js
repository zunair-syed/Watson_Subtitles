var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
var moment = require('moment');

var speech_to_text = new SpeechToTextV1({
    username: "e74ded25-c9d2-4c77-9493-6fd91d75d467",
    password: "awLNUuzg4I7D"
});

// var params = {
//   // From file
//   audio: fs.createReadStream(__dirname + '/obama.wav'),
//   content_type: 'audio/wav; rate=44100',
//   timestamps:true,
//   continuous:true,
//   profanity_filter:true,
//   smart_formatting:true
// };

// speech_to_text.recognize(params, function(err, res) {
//   if (err)
//     console.log(err);
//   else
//     console.log(JSON.stringify(res, null, 2));
// });

module.exports.getSpeechText = (pathToVid, name) => {
    console.log("trying to getSpeechText")
    return new Promise((resolve, reject) => {
        var params = {
          audio: fs.createReadStream(__dirname + "/../public/RAW_VIDEO/" + name + ".wav"),
          content_type: 'audio/wav; rate=44100',
          timestamps:true,
          continuous:true,
          profanity_filter:true,
          smart_formatting:true
        };

        speech_to_text.recognize(params, function(err, res) {
            if(err){reject(err)}
            else {resolve(res)}
        });
    })
}

module.exports.toSRTFormat = (json) => {
    return new Promise((resolve, reject) => {
        if(!json || !json.results || json.results == 0) {
            reject("missing_response_results");
            return;
        }

        var fileString = "";
        var results = json.results;
        results.forEach((line, i) => {

            var timestampArr = line.alternatives[0].timestamps;
            var startTime = getStartTime(timestampArr);
            var endTime = getEndTime(timestampArr);
            startTime = formatTimestamp(startTime);
            endTime = formatTimestamp(endTime);

            fileString += (i + 1) + "\n";
            fileString += startTime + " --> " + endTime + "\n";
            fileString += line.alternatives[0].transcript + "\n\n";

        })

        resolve(fileString);

    })
}


module.exports.saveSRTFile = (pathToVid, name, srtString) => {
    return new Promise((resolve, reject) => {
        if(!srtString) {
            reject("missing_srtString");
            return;
        }

        fs.writeFile(pathToVid + name + ".srt", srtString, (err) => {
            if(err) {reject(err)}
            else{resolve()}
        });

    })
}


var getStartTime = (arr) => {
    return (arr[0])[1];
}

var getEndTime = (arr) => {
    return (arr[arr.length - 1])[2];
}

var formatTimestamp = (seconds) => {
    var secondsWithoutMS = parseInt((seconds + "").split(".")[0]);
    var ms = (seconds + "").split(".")[1];
    ms = ms ? ms : 0;
    var timestamp = moment().startOf('day').add(seconds, 's');
    return timestamp.format('HH:mm:ss[,'+ms+']');
}


// // or streaming
// fs.createReadStream(__dirname + '/cog.wav')
//   .pipe(speech_to_text.createRecognizeStream({ content_type: 'audio/wav; rate=44100' }))
//   .pipe(fs.createWriteStream('./transcription.txt'));
