"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl_core_1 = __importDefault(require("ytdl-core"));
class MusicGuild {
    constructor() {
        this.queue_ = [];
    }
    addSong(song) {
        this.queue_.push(song);
    }
    nextSong() {
        if (MusicGuild.currentIndex + 1 == this.queue_.length)
            return undefined;
        MusicGuild.currentIndex++;
        return this.queue_[MusicGuild.currentIndex];
    }
    prevSong() {
        if (MusicGuild.currentIndex - 1 == -1)
            return undefined;
        MusicGuild.currentIndex--;
        return this.queue_[MusicGuild.currentIndex];
    }
    //! here bad way
    currentSong() {
        return this.queue_[MusicGuild.currentIndex];
    }
    get queue() {
        return this.queue_;
    }
    set queue(newVal) {
        this.queue_ = newVal;
    }
    play(song, msg) {
        if (MusicGuild.connection == undefined)
            return;
        try {
            const dispatcher = MusicGuild.connection.play(ytdl_core_1.default(song.link), { highWaterMark: 1024 * 1024 * 10 });
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
                this.play(nextSong, msg);
            });
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.default = MusicGuild;
MusicGuild.isPlaying = false;
MusicGuild.currentIndex = 0;
