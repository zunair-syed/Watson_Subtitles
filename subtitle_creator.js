"use strict";


var video = require('./util/video.js')
var watsonToText = require('./watson_services/speech_to_text.js');


module.exports = class subtitle_creator {
    constructor() {
        console.log("being init");
        this.addSpeechAnalysis("/Users/zunairsyed/Documents/Waterloo_CE/Side_Projects/Watson_Subtitles/Watson_Subtitles/public/RAW_VIDEO/ellen.mp4");
        // this.findAndStartSubtitleProcess()
        // this.addSpeechAnalysis("");
        // this.slackbot.uploadVideo("/Users/zunairsyed/Documents/Waterloo_CE/Side_Projects/watson_slack/watson_for_slack/slack/slack_downloads/obama.srt", "G4D4UTNBB")
    }

    findAndStartSubtitleProcess(){

    }

    addSpeechAnalysis(file_name){
        //1) Download the slack video to slack/slack_downloads
        //2) Extract the wav file from the video, save in slack/slack_downloads
        //3) Send wav file to watson, Parse response
        //4) Convert response to srt, save srt in public/slack_uploads
        //5) Attach srt to video
        //6) post video onto slack

        var name = (file_name.split("/")[file_name.split("/").length - 1]).split(".")[file_name.split(".").length - 2];
        var extension = "."+file_name.split(".")[file_name.split(".").length - 1];
        var pathToVid = file_name.split(name)[0]

        console.log("pathToVid: " + pathToVid);
        console.log("name: " + name);
        console.log("extension: " + extension);

        video.extractAudio(pathToVid, name, extension)
            .then(() => {
                console.log("extracted audio");
                // this.slackbot.say("_Proccessing *10%* Done_", source.file.groups[0])
                return watsonToText.getSpeechText(pathToVid, name);
            }, (err) => {
                console.log("err in extracting audio: " + err)
            })
            .then((json) => {
                console.log("getSpeechText done");
                console.log("json :" + JSON.stringify(json, null, 4));
                // this.slackbot.say("_Proccessing *65%* Done_", source.file.groups[0])

                return watsonToText.toSRTFormat(json);
            }, (text_err) => {
                console.log("err in watson speech: " + text_err);
            })
            .then((srtString) => {
                console.log("toSRTFormat done");
                console.log("srtString :" + srtString);

                return watsonToText.saveSRTFile(pathToVid, name, srtString);
            }, (srtFortmatErr) => {
                console.log("err in srtFormatting: " + srtFortmatErr)
            })
            .then(() => {
                console.log("saveSRTFile done");
                var writePath = __dirname + "/public/video_upload/"
                return video.attachSrt(pathToVid, name, extension, writePath)
            }, (saveSRTErr) => {
                console.log("err in savingSRT: " + saveSRTErr)
            })
            .then((fullpath) => {
                console.log("fullpath: " + fullpath);
                // this.slackbot.say("_Proccessing *90%* Done _", source.file.groups[0])
                //
                // // setTimeout( () => {
                //     this.slackbot.uploadVideo(fullpath, source.file.groups[0]);
                // }, 5000);
                console.log("finished");
            }, (attachSrtErr) => {
                console.log("err in attachSrtErr: " + attachSrtErr)
            })

    }



}
