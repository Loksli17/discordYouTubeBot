import Discord             from 'discord.js';
import MessageEmbedAdapter from '../utils/MessageEmbedAdapter';
import MusicGuild          from './MusicGuild';
import Song                from '../utils/Song';


export default class DispatherDecorator {

    private static messageEmded: MessageEmbedAdapter = new MessageEmbedAdapter();

    private static createStart(guild: MusicGuild): () => void{
        return () => {
            
            this.messageEmded.songStart(guild.discordMessage, guild.getCurrentSong());

            clearInterval(guild.interval);

            guild.currentSeconds = 0;

            guild.interval = setInterval(() => {
                guild.currentSeconds++;
            }, 1000);

            guild.isPlaying = true;
        }
    }

    private static createFinish(guild: MusicGuild): () => void {
        return () => {
            const nextSong: Song | undefined = guild.nextSong();
            
            this.messageEmded.songEnd(guild.discordMessage, guild.getCurrentSong());
            
            if(nextSong == undefined){
                this.messageEmded.noSongs(guild.discordMessage);
                guild.isPlaying = false;
                guild.currentIndex++;
                return;
            }

            guild.play(nextSong);
            
            guild.isPlaying = false;
        }
    }

    public static execute(guild: MusicGuild, dispatcher: Discord.StreamDispatcher): Discord.StreamDispatcher {
        dispatcher.on('start', this.createStart(guild));
        dispatcher.on('finish', this.createFinish(guild));
        return dispatcher;
    }
}