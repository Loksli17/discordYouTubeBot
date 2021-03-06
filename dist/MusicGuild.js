"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
class MusicGuild {
    constructor() {
        this.hasMusic = false;
        this.isPlaying = false;
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
    // public prevSong(): Song | undefined{
    //     if(MusicGuild.currentIndex - 1 == -1) return undefined;
    //     MusicGuild.currentIndex--;
    //     return this.queue_[MusicGuild.currentIndex];
    // }
    // public currentSong(): Song | undefined{
    //     return this.queue_[MusicGuild.currentIndex];
    // }
    // public get queue(): Array<Song>{
    //     return this.queue_;
    // }
    // public set queue(newVal: Array<Song>){
    //     this.queue_ = newVal;
    // }
    // public pause(msg: Discord.Message): void {
    //     if(MusicGuild.connection == undefined) { msg.reply('Error with connection'); return; }
    //     const embed: Discord.MessageEmbed = new MessageEmbed();
    //     embed.setColor('#A84300');
    //     if(!this.hasMusic){
    //         embed.setDescription("Livsi **doesn`t** have* music");
    //         msg.channel.send(embed);
    //         return;
    //     }
    //     if(!this.isPlaying){
    //         embed.setDescription('Livsi **already** has been **paused**');
    //         msg.channel.send(embed);
    //         return;
    //     }
    //     this.isPlaying = false;
    //     MusicGuild.connection.dispatcher.pause();
    //     embed.setDescription('Livsi has been **paused**');
    //     msg.channel.send(embed);
    // }
    // public resume(msg: Discord.Message): void {
    //     if(MusicGuild.connection == undefined) { msg.reply('Error with connection'); return; }
    //     const embed: Discord.MessageEmbed = new MessageEmbed();
    //     embed.setColor('#A84300');
    //     if(!MusicGuild.hasMusic){
    //         embed.setDescription("Livsi *doesn`t have* music");
    //         msg.channel.send(embed);
    //         return;
    //     }
    //     if(this.isPlaying && MusicGuild.hasMusic){
    //         embed.setDescription('Livsi **already** has been **resumed**');
    //         msg.channel.send(embed);
    //         return;
    //     }
    //     this.isPlaying = true;
    //     MusicGuild.connection.dispatcher.resume();
    //     embed.setDescription('Livsi has been **resumed**');
    //     msg.channel.send(embed);
    // }
    play(song, msg) {
        if (this.connection == undefined)
            return;
        try {
            const dispatcher = this.connection.play(ytdl_core_1.default(song.link), { highWaterMark: 1024 * 1024 * 10 });
            dispatcher.on('start', () => {
                const embed = new discord_js_1.MessageEmbed();
                embed.setColor('#A84300');
                embed.setDescription(`Song **${song.name}** was **started** with duration **${song.duration}**`);
                msg.channel.send(embed);
                clearInterval(MusicGuild.interval);
                MusicGuild.currentSeconds = 0;
                MusicGuild.interval = setInterval(() => {
                    MusicGuild.currentSeconds++;
                }, 1000);
                this.isPlaying = true;
            });
            dispatcher.on('finish', () => {
                const embed = new discord_js_1.MessageEmbed(), nextSong = this.nextSong();
                embed.setColor('#A84300');
                embed.setDescription(`Song **${song.name}** was **ended** with duration **${song.duration}**`);
                msg.channel.send(embed);
                if (nextSong == undefined) {
                    embed.setDescription(`I **don't have** song anymore`);
                    msg.channel.send(embed);
                    this.hasMusic = false;
                    MusicGuild.currentIndex++;
                    return;
                }
                this.play(nextSong, msg);
                this.isPlaying = false;
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
    formatSeconds(curSec) {
        let min = Math.floor(curSec / 60), h = Math.floor(curSec / 3600), sec = curSec - min * 60;
        let minStr = min.toString(), hStr = h.toString(), secStr = sec.toString();
        if (hStr.length == 1)
            hStr = "0" + hStr;
        if (minStr.length == 1)
            minStr = "0" + minStr;
        if (secStr.length == 1)
            secStr = "0" + secStr;
        return `${hStr}:${minStr}:${secStr}`;
    }
}
exports.default = MusicGuild;
MusicGuild.currentIndex = 0;
MusicGuild.currentSeconds = 0;
