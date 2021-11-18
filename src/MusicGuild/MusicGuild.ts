import Discord, {  Message } from 'discord.js';
import ytdl                  from 'ytdl-core';
import MessageEmbedAdapter   from '../utils/MessageEmbedAdapter';
import Song                  from '../utils/Song';
import DispatherFactory      from './DispatherFactory';


export default class MusicGuild{

    private isPlaying_: boolean     = false;
    private queue_    : Array<Song> = [];
    
    private currentIndex_   : number = 0;
    private currentSeconds_ : number = 0;
    private interval_!      : NodeJS.Timeout;
    
    private connection_!    : Discord.VoiceConnection;
    private dispatcher!     : Discord.StreamDispatcher;
    private discordMessage_!: Message;
   
    private messageEmded: MessageEmbedAdapter = new MessageEmbedAdapter();
    

    public get discordMessage(): Message    { return this.discordMessage_ || null} 
    public set discordMessage(val: Message) { this.discordMessage_ = val }

    public get connection(): Discord.VoiceConnection    { return this.connection_ || null }
    public set connection(val: Discord.VoiceConnection) { this.connection_ = val; }

    public get isPlaying(): boolean    { return this.isPlaying_ }
    public set isPlaying(val: boolean) { this.isPlaying_ = val }

    public get interval(): NodeJS.Timeout    { return this.interval_ }
    public set interval(val: NodeJS.Timeout) { this.interval_ = val }

    public get currentSeconds(): number    { return this.currentSeconds_ }
    public set currentSeconds(val: number) { this.currentSeconds_ = val }

    public get currentIndex(): number    { return this.currentIndex_ }
    public set currentIndex(val: number) { this.currentIndex_ = val }

    
    // private createDispather(msg: Discord.Message, song: Song): Discord.StreamDispatcher {

    //     // const test: any = this.connection?.dispatcher

    //     const dispatcher: Discord.StreamDispatcher = this.connection!.play(ytdl(song.link), { highWaterMark: 1024 * 1024 * 10 });

    //     dispatcher.on('start', () => {
            
    //         this.messageEmded.songStart(msg, song);

    //         clearInterval(MusicGuild.interval);

    //         MusicGuild.currentSeconds = 0;
    //         MusicGuild.interval = setInterval(() => {
    //             MusicGuild.currentSeconds++;
    //         }, 1000);

    //         this.isPlaying = true;
    //     });

    //     dispatcher.on('finish', () => {
            
    //         const nextSong: Song | undefined = this.nextSong();
            
    //         this.messageEmded.songEnd(msg, song);
            
    //         if(nextSong == undefined){
    //             this.messageEmded.noSongs(msg, song);
    //             this.isPlaying = false;
    //             MusicGuild.currentIndex++;
    //             return;
    //         }

    //         this.play(nextSong, msg);
            
    //         this.isPlaying = false;
    //     });

    //     return dispatcher;
    // }


    public addSong(song: Song): void { this.queue_.push(song); }

    public getCurrentSong(): Song { return this.queue_[this.currentIndex_]; }

    public nextSong(): Song | undefined {
        if(this.currentIndex_ + 1 == this.queue_.length) return undefined;
        this.currentIndex_;
        return this.queue_[this.currentIndex_];
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


    public play(song: Song): void {

        console.log('dispatcher:', this.connection.dispatcher);

        try {
            this.dispatcher = this.connection!.play(ytdl(song.link), { highWaterMark: 1024 * 1024 * 10 });
            this.dispatcher = DispatherFactory.execute(this, this.dispatcher); 
        } catch (error) {
            this.messageEmded.playError(this.discordMessage_, song);
            console.error(error);
        }  
    }
}