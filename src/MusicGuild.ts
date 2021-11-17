import Discord, { MessageEmbed } from 'discord.js';
import ytdl                      from 'ytdl-core';
import MessageEmbedAdapter       from './utils/MessageEmbedAdapter';
import Song                      from './utils/Song';



export default class MusicGuild{

    public         isPlaying     : boolean     = false;
    private        queue_        : Array<Song> = [];
    public  static currentIndex  : number      = 0;
    public  static currentSeconds: number = 0;
    public         connection    : Discord.VoiceConnection | undefined;
    private static interval      : NodeJS.Timeout;
    private        messageEmded  : MessageEmbedAdapter = new MessageEmbedAdapter();


    private createDispather(msg: Discord.Message, song: Song): Discord.StreamDispatcher {

        const dispatcher: Discord.StreamDispatcher = this.connection!.play(ytdl(song.link), {highWaterMark: 1024 * 1024 * 10});

        dispatcher.on('start', () => {
            
            this.messageEmded.songStart(msg, song);

            clearInterval(MusicGuild.interval);

            MusicGuild.currentSeconds = 0;
            MusicGuild.interval = setInterval(() => {
                MusicGuild.currentSeconds++;
            }, 1000);

            this.isPlaying = true;
        });

        dispatcher.on('finish', () => {
            
            const nextSong: Song | undefined = this.nextSong();
            
            this.messageEmded.songEnd(msg, song);
            
            if(nextSong == undefined){
                this.messageEmded.noSongs(msg, song);
                this.isPlaying = false;
                MusicGuild.currentIndex++;
                return;
            }

            this.play(nextSong, msg);
            
            this.isPlaying = false;
        });

        return dispatcher;
    }

    public setConnection(connection: Discord.VoiceConnection): void {
        this.connection = connection;
    }
 

    public addSong(song: Song): void{
        this.queue_.push(song);
    }

    
    public nextSong(): Song | undefined {
        if(MusicGuild.currentIndex + 1 == this.queue_.length) return undefined;
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


    public play(song: Song, msg: Discord.Message): void{

        if(this.isPlaying){
            //todo play next song in queue 
            return;
        }

        try {
           this.createDispather(msg, song); 
        } catch (error) {
            console.error(error);
        }   
    }
}