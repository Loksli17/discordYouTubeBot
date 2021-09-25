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
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const youtube = googleapis_1.google.youtube({
    auth: 'AIzaSyCMJGB1MaBgoN78v8PkmuMEJOLs6_CYHME',
    version: 'v3'
});
const commands = [
    {
        name: 'play',
        //! REFACTOR THIS BEFORE ANOTHER CODING !!!!!!
        out: (bot, msg, words) => __awaiter(void 0, void 0, void 0, function* () {
            let channel = msg.member.voice.channel;
            youtube.search.list({ part: ['snippet'], q: words.join(' '), maxResults: 1 }, (error, data) => {
                console.log(error);
                msg.channel.send(`https://www.youtube.com/watch?v=${data.data.items[0].id.videoId}`);
                console.log(data.data.items[0].snippet.title);
                channel === null || channel === void 0 ? void 0 : channel.join().then((connection) => __awaiter(void 0, void 0, void 0, function* () {
                    const dispatcher = connection.play(ytdl_core_1.default(`https://www.youtube.com/watch?v=${data.data.items[0].id.videoId}`, {
                        highWaterMark: 1024 * 1024 * 10
                    }))
                        .on('start', () => {
                        msg.channel.send(`--- Now playing ${data.data.items[0].snippet.title} ---`);
                    })
                        .on('finish', () => {
                        msg.channel.send(`--- End playing of ${data.data.items[0].snippet.title} ---`);
                    });
                }));
            });
        }),
        about: 'Command for play youtube video',
    },
    {
        name: 'current',
        out: (bot, msg, words) => {
            msg.channel.send('Now playing smth');
        },
        about: 'Command for send current audio',
    },
    {
        name: 'queue',
        about: 'Command for send qeueu',
        out: (bot, msg, words) => {
            msg.channel.send(`${['ahaha', 'ahah', 'haha']}`);
        },
    }
];
exports.default = commands;
