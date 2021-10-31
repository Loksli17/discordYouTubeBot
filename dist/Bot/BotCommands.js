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
const MusicGuild_1 = __importDefault(require("../MusicGuild"));
const YouTubeAdapter_1 = __importDefault(require("../utils/YouTubeAdapter"));
class BotCommands {
    constructor(msg) {
        this.words = [];
        this.msg = msg;
        this.guild = new MusicGuild_1.default();
        this.youtube = new YouTubeAdapter_1.default();
    }
    get message() { return this.msg; }
    set message(msg) { this.msg = msg; }
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            let channel = this.msg.member.voice.channel, song = yield this.youtube.searchSong(this.words);
            this.guild.addSong(song);
            if (!this.guild.hasMusic) {
                this.guild.hasMusic = true;
                this.guild.connection = yield (channel === null || channel === void 0 ? void 0 : channel.join().catch(error => console.error(error)));
                if (this.guild.connection == undefined) {
                    this.msg.reply('Error with connection');
                    return;
                }
                this.guild.play(song, this.msg);
            }
        });
    }
    pause() {
        console.log('pause');
    }
    resume() {
        console.log('resume(');
    }
    prev() {
        console.log('prev');
    }
    next() {
        console.log('next');
    }
    current() {
        console.log('current');
    }
    queue() {
        console.log('queue');
    }
    remove() {
        console.log('remove');
    }
    playAhaha() {
        console.log('playAhaha');
    }
    sayAhaha() {
        console.log('Ahahahah hahahahh hahah ahahah hahahah hahahah');
    }
}
exports.default = BotCommands;
