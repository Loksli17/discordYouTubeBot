"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl_core_1 = __importDefault(require("ytdl-core"));
class MusicGuild {
    constructor() {
        this.queue = [];
    }
    addSong(song) {
        this.queue.push(song);
    }
    nextSong() {
        if (MusicGuild.currentIndex + 1 == this.queue.length)
            return undefined;
        MusicGuild.currentIndex++;
        return this.queue[MusicGuild.currentIndex];
    }
    prevSong() {
        if (MusicGuild.currentIndex - 1 == 0)
            return undefined;
        MusicGuild.currentIndex--;
        return this.queue[MusicGuild.currentIndex];
    }
    play(connection, msg) {
        const song = this.queue[MusicGuild.currentIndex], dispatcher = connection.play(ytdl_core_1.default(song.link), { highWaterMark: 1024 * 1024 * 10 });
        console.log(song, 'azazazaa');
        dispatcher.on('start', () => {
            msg.channel.send(`--- Now playing ${song.name} ---`);
        });
        dispatcher.on('finish', () => {
            msg.channel.send(`--- End playing of ${song.name} ---`);
            const nextSong = this.nextSong();
            if (nextSong == undefined) {
                //leave
                msg.channel.send(`--- No more songs !! ---`);
                MusicGuild.isPlaying = false;
                MusicGuild.currentIndex++; //! it can be ERORR ATTENTION
                return;
            }
            this.play(connection, msg);
        });
    }
}
exports.default = MusicGuild;
MusicGuild.isPlaying = false;
MusicGuild.currentIndex = 0;
