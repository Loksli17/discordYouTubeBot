"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const configChipher_1 = __importDefault(require("../config/configChipher"));
const Song_1 = __importDefault(require("./Song"));
const TimeFormatter_1 = __importDefault(require("./TimeFormatter"));
class YouTubeAdapter {
    constructor() {
        this.youtube = googleapis_1.google.youtube({
            auth: configChipher_1.default.youtubeKey,
            version: 'v3'
        });
    }
    searchSong(words) {
        return __awaiter(this, void 0, void 0, function* () {
            let song = new Song_1.default(), videoName = '', thumbnail = '', link = 'https://www.youtube.com/watch?v=', durationData = undefined, data = undefined;
            data = yield this.youtube.search.list({ part: ['snippet'], q: words.join(' '), maxResults: 1 }).catch(error => console.error(error));
            if (data == undefined) {
                throw new Error();
            }
            durationData = yield this.youtube.videos.list({
                "part": [
                    "contentDetails, snippet"
                ],
                "id": [
                    data.data.items[0].id.videoId,
                ]
            }).catch(error => console.error(error));
            link += data.data.items[0].id.videoId;
            videoName = data.data.items[0].snippet.title;
            thumbnail = durationData.data.items[0].snippet.thumbnails.default.url;
            let { duration, seconds } = TimeFormatter_1.default.formatDuration(durationData.data.items[0].contentDetails.duration);
            song.setDuration(duration).setLink(link).setName(videoName).setSeconds(seconds).setThumbnail(thumbnail);
            return song;
        });
    }
}
exports.default = YouTubeAdapter;
