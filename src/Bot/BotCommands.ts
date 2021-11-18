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


    public async play() {
        
        let 
            connection: any, 
            channel   : Discord.VoiceChannel | null = this.msg.member!.voice.channel,
            song      : Song                        = await this.youtube.searchSong(this.words);

        this.guild.addSong(song);
        this.guild.message = this.msg;
        
        if(this.guild.isPlaying) return;

        connection = await channel?.join().catch(error => console.error(error));

        console.log('conn:', connection);

        if(connection == undefined){
            this.messageEmded.joinVoiceChannelWarning(this.msg);
            console.error("Bad voice connection");
            return;
        }

        this.guild.connection = connection;
        this.guild.play(song, this.msg);        
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
        console.log('current');
    }


    public queue() {
        console.log('queue');
    }


    public remove() {
        console.log('remove');
    }


    public playAhaha() {
        console.log('playAhaha');
    }


    public sayAhaha() {
        console.log('Ahahahah hahahahh hahah ahahah hahahah hahahah');
    }
}