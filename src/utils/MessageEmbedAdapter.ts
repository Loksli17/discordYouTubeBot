import Discord, { MessageEmbed } from 'discord.js';
import Song                      from './Song';


export default class MessageEmbedAdapter{

    protected color: string = '#A84300';

    private messageWithDescription(msg: Discord.Message, text: string){
        const embed: Discord.MessageEmbed = new MessageEmbed();
        embed.setColor(this.color);
        embed.setDescription(text);
        msg.channel.send(embed);
    }


    public songStart(msg: Discord.Message, song: Song): void{
        this.messageWithDescription(msg, `Song **${song.name}** was **started** with duration **${song.duration}**`);
    }

    public songEnd(msg: Discord.Message, song: Song): void{
        this.messageWithDescription(msg, `Song **${song.name}** was **ended** with duration **${song.duration}**`);
    }

    public noSongs(msg: Discord.Message, song: Song): void{
        this.messageWithDescription(msg, `I **don't have** song anymore`);
    }

    public joinVoiceChannelWarning(msg: Discord.Message){
        this.messageWithDescription(msg, `Before playing you should **join to voice channel**`);
    }

}