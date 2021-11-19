import Discord, {  Message } from 'discord.js';
import ytdl                  from 'ytdl-core';
import MessageEmbedAdapter   from '../utils/MessageEmbedAdapter';
import Song                  from '../utils/Song';
import DispatherDecorator    from './DispatherDecorator';


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

    public get queue(): Array<Song>       { return this.queue_ }
    public set queue(newVal: Array<Song>) { this.queue_ = newVal }


    /**
     * 
     * @param song 
     * @returns void
     */
    public addSong(song: Song): void { this.queue_.push(song); }

    public getCurrentSong(): Song | undefined { return this.queue_[this.currentIndex_]; }

    public removeSong(index: number): void {
        this.queue_ = this.queue_.filter((song: Song, songInd: number) => songInd != index);
    }

    public getSong(index: number): Song | undefined {
        return this.queue_[index];
    }

    public amountSongs(): number {
        return this.queue_.length;
    }

    public nextSong(): Song | undefined {
        if(this.currentIndex_ + 1 == this.queue_.length) return undefined;
        this.currentIndex_++;
        return this.queue_[this.currentIndex_];
    }

    /**
     * @returns void
     */
    public stop(): void {
        this.isPlaying_ = false;
        this.connection_.dispatcher.destroy(); //todo finish playing with another way it's bad variant
    }

    // public prevSong(): Song | undefined{
    //     if(MusicGuild.currentIndex - 1 == -1) return undefined;
    //     MusicGuild.currentIndex--;
    //     return this.queue_[MusicGuild.currentIndex];
    // }


    // public currentSong(): Song | undefined{
    //     return this.queue_[MusicGuild.currentIndex];
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


    /**
     * @param song 
     * @returns void
     */
    public play(song: Song): void {

        try {
            this.dispatcher = this.connection!.play(ytdl(song.link), { highWaterMark: 1024 * 1024 * 10 });
            this.dispatcher = DispatherDecorator.execute(this, this.dispatcher); 
        } catch (error) {
            this.messageEmded.playError(this.discordMessage_, song);
            console.error(error);
        }  
    }
}