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
                    // !leave
                    msg.channel.send(`--- No more songs !! ---`);
                    MusicGuild.isPlaying = false;
                    MusicGuild.currentIndex++;
                    return;
                }
                this.play(nextSong, msg);
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    formatDuration(duration) {
        let min = '', sec = '', hou = '';
        let result = duration.match(/\d+H/g);
        hou = result != null ? result[0] : '00';
        if (hou.length == 2)
            hou = "0" + hou;
        hou = hou.substr(0, 2);
        result = duration.match(/\d+M/g);
        min = result != null ? result[0] : '00';
        if (min.length == 2)
            min = "0" + min;
        min = min.substr(0, 2);
        result = duration.match(/\d+S/g);
        sec = result != null ? result[0] : '00';
        if (sec.length == 2)
            sec = "0" + sec;
        sec = sec.substr(0, 2);
        return {
            duration: `${hou}:${min}:${sec}`,
            seconds: Number(hou) * 3600 + Number(min) * 60 + Number(sec)
        };
    }
}
exports.default = MusicGuild;
MusicGuild.isPlaying = false;
MusicGuild.currentIndex = 0;
