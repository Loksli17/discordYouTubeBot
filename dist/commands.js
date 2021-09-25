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
const MusicGuild_1 = __importDefault(require("./MusicGuild"));
const youtube = googleapis_1.google.youtube({
    auth: 'AIzaSyCMJGB1MaBgoN78v8PkmuMEJOLs6_CYHME',
    version: 'v3'
});
const musicGuild = new MusicGuild_1.default();
const commands = [
    {
        name: 'play',
        about: 'Command for play youtube video',
        // ! don't forget about try catch
        out: (bot, msg, words) => __awaiter(void 0, void 0, void 0, function* () {
            let channel = msg.member.voice.channel, link = 'https://www.youtube.com/watch?v=', videoName = '', data, connection;
            data = yield youtube.search.list({ part: ['snippet'], q: words.join(' '), maxResults: 1 }).catch(error => console.error(error));
            if (data == undefined) {
                msg.reply('Error with Google API');
                return;
            }
            //! add checking here
            link += data.data.items[0].id.videoId;
            videoName = data.data.items[0].snippet.title;
            msg.channel.send(link);
            let song = {
                link: link,
                duration: '00:00',
                name: videoName,
            };
            musicGuild.addSong(song);
            if (!MusicGuild_1.default.isPlaying) {
                MusicGuild_1.default.isPlaying = true;
                connection = yield (channel === null || channel === void 0 ? void 0 : channel.join().catch(error => console.error(error)));
                if (connection == undefined) {
                    msg.reply('Error with connection');
                    return;
                }
                MusicGuild_1.default.connection = connection;
                musicGuild.play(song, msg);
            }
        }),
    },
    {
        name: 'pause',
        about: 'Command for pause audio',
        out: (bot, msg, words) => {
        }
    },
    {
        name: 'prev',
        about: 'Command for pause audio',
        out: (bot, msg, words) => {
            let song = musicGuild.prevSong();
            if (song == undefined) {
                msg.reply('No songs');
                return;
            }
            musicGuild.play(song, msg);
        }
    },
    {
        name: 'next',
        about: 'Command for pause audio',
        out: (bot, msg, words) => {
            let song = musicGuild.nextSong();
            if (song == undefined) {
                msg.reply('No more songs');
                return;
            }
            musicGuild.play(song, msg);
        }
    },
    {
        name: 'current',
        about: 'Command for send current audio',
        out: (bot, msg, words) => {
            let song = musicGuild.currentSong();
            if (song == undefined) {
                msg.reply('No more songs');
                return;
            }
            musicGuild.play(song, msg);
        },
    },
    {
        name: 'queue',
        about: 'Command for send qeueu',
        out: (bot, msg, words) => {
            msg.channel.send(`${musicGuild.queue}`);
        },
    }
];
exports.default = commands;
