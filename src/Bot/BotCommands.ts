import Discord, { Message } from 'discord.js'
import MusicGuild           from '../MusicGuild/MusicGuild';
import Song                 from '../utils/Song';
import YouTubeAdapter       from '../utils/YouTubeAdapter';
import MessageEmbedAdapter  from '../utils/MessageEmbedAdapter';


export default abstract class BotCommands {

    protected msg!        : Message;      //todo rename it to discord message
    protected words       : Array<string>;
    protected guild       : MusicGuild;
    protected youtube     : YouTubeAdapter;
    protected messageEmded: MessageEmbedAdapter;

    public get message(): Message { return this.msg || null }
    public set message(msg: Message) { this.msg = msg }


    constructor(){
        this.guild        = new MusicGuild();
        this.youtube      = new YouTubeAdapter();
        this.words        = [];
        this.messageEmded = new MessageEmbedAdapter();
    }


    /**
     * todo check joing bot to channel
     * @returns Promise<void>
     */
    public async play(): Promise<void> {
        
        let 
            connection: any, 
            channel   : Discord.VoiceChannel | null = this.msg.member!.voice.channel,  //todo fix this
            song      : Song                        = await this.youtube.searchSong(this.words); //todo fix this

        this.guild.addSong(song);
        this.guild.discordMessage = this.msg;
        
        if(this.guild.isPlaying) return;

        connection = await channel?.join().catch(error => console.error(error));

        if(connection == undefined){
            this.messageEmded.joinVoiceChannelWarning(this.msg);
            console.error("Bad voice connection");
            return;
        }

        this.guild.connection = connection;
        this.guild.play(song);        
    }


    public pause() {
        console.log('pause');
    }


    public resume() {
        console.log('resume(');
    }


    public prev() {
        console.log('prev');
    }


    public next() {
        console.log('next');
    }


    public current() {
        const song: Song | undefined = this.guild.getCurrentSong();

        if(song == undefined) { this.msg.reply('No more songs'); return; }

        // this.messageEmded.current(this.msg, this.guild.getCurrentSong(), this.guild.currentIndex, this.guild.currentSeconds);
    }


    public queue() {
        this.messageEmded.showQueue(this.msg, this.guild.queue, this.guild.currentIndex)
    }


    /**
     * this method removes song with entering index
     * if guild doen't has song user will get embed message
     * if user removes current song playing will be destroy() 
     * @returns void
     */
    public remove(): void {
        let
            song : Song | undefined = undefined, 
            index: number           = Number(this.words[2]) - 1;

        if(!this.guild.amountSongs){
            this.messageEmded.noSongs(this.msg);
            return;
        }
        
        if(Number(isNaN)) {
            this.messageEmded.unexpectedIndex(this.msg, this.guild.amountSongs());
            return;
        }

        song = this.guild.getSong(index);

        if(song == undefined) {
            this.messageEmded.unexpectedIndex(this.msg, this.guild.amountSongs());
            return;
        }

        this.guild.removeSong(index);
        this.messageEmded.deletedSong(this.msg, song);

        if(this.guild.currentIndex == index) {
            this.guild.stop();
            let nextSong: Song | undefined = this.guild.nextSong();
            if(nextSong) this.guild.play(nextSong);
        }
    }


    public clearQueue(): void {
        this.guild.queue = [];
        this.guild.stop();
        this.messageEmded.clearQueue(this.msg);
    }


    public playAhaha() {
        console.log('playAhaha');
    }


    public sayAhaha() {
        console.log('Ahahahah hahahahh hahah ahahah hahahah hahahah');
    }
}