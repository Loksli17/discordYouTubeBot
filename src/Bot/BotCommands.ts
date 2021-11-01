import Discord, { Message } from 'discord.js'
import MusicGuild           from '../MusicGuild';
import Song                 from '../utils/Song';
import YouTubeAdapter       from '../utils/YouTubeAdapter';
import MessageEmbedAdapter  from '../utils/MessageEmbedAdapter';

/**
 * ! create this bot how Singleton class
 */

export default class BotCommands {

    protected msg         : Message;
    protected words       : Array<string>;
    protected guild       : MusicGuild;
    protected youtube     : YouTubeAdapter;
    protected messageEmded: MessageEmbedAdapter;

    public get message(): Message { return this.msg }
    public set message(msg: Message) { this.msg = msg }

    constructor(msg: Message){
        this.msg          = msg;
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
        
        if(this.guild.isPlaying){
            return;
        }

        connection = await channel?.join().catch(error => console.error(error));

        if(connection == undefined){
            this.messageEmded.joinVoiceChannelWarning(this.msg);
            console.error("Bad voice connection");
            return;
        }

        this.guild.setConnection(connection);
        this.guild.play(song, this.msg);

        // if(!this.guild.hasMusic){

        //     this.guild.hasMusic   = true;
        //     this.guild.connection = await channel?.join().catch(error => console.error(error));

        //     if(this.guild.connection == undefined) { this.msg.reply('Error with connection'); return; }

        //     this.guild.play(song, this.msg);
        // }
        
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