import Discord, { MessageEmbed } from 'discord.js';
import Song                      from './Song';
import TimeFormatter             from './TimeFormatter';


export default class MessageEmbedAdapter{

    protected color: string = '#A84300';

    private messageWithDescription(msg: Discord.Message, text: string): void{
        const embed: Discord.MessageEmbed = new MessageEmbed();
        embed.setColor(this.color);
        embed.setDescription(text);
        msg.channel.send(embed);
    }

    private messageWithField(title: string, fieldTop: string, fieldContent: string, thumbnail: string): void {
        const embed: Discord.MessageEmbed = new MessageEmbed();
        embed.setColor(this.color);
        embed.setTitle(title);
        embed.addField(fieldTop, fieldContent);
        embed.setThumbnail(thumbnail);
    }


    public songStart(msg: Discord.Message, song: Song): void{
        this.messageWithDescription(msg, `Song **${song.name}** was **started** with duration **${song.duration}**`);
    }

    public songEnd(msg: Discord.Message, song: Song): void{
        this.messageWithDescription(msg, `Song **${song.name}** was **ended** with duration **${song.duration}**`);
    }

    public noSongs(msg: Discord.Message): void{
        this.messageWithDescription(msg, `I **don't have** song anymore`);
    }

    public joinVoiceChannelWarning(msg: Discord.Message){
        this.messageWithDescription(msg, `Before playing you should **join to voice channel**`);
    }

    public dispatcherProblem(msg: Discord.Message){
        this.messageWithDescription(msg, `Problems with dispather`);
    }

    public playError(msg: Discord.Message, song: Song){
        this.messageWithDescription(msg, `Error when trying to play song ${song.name}`);
    }

    public unexpectedIndex(msg: Discord.Message, len: number){
        this.messageWithDescription(msg, `Index must be from **1** to **${len}**`);
    }

    public deletedSong(msg: Discord.Message, song: Song){
        this.messageWithDescription(msg, `Song: **${song.name}** was removed`);
    }

    public clearQueue(msg: Discord.Message){
        this.messageWithDescription(msg, `Queue has been **cleared**`);
    }

    
    public showQueue(msg: Discord.Message, queue: Array<Song>, currentIndex: number) {
        
        let
            embed: Discord.MessageEmbed = new MessageEmbed(),
            songs: Array<Song>          = queue,
            start: number               = (currentIndex - 4) > 0          ? currentIndex - 4 : 0,
            end  : number               = currentIndex + 5 > songs.length ? songs.length     : currentIndex + 5;

        embed.setColor(this.color);
        embed.setTitle('Queue');

        if(start == end) {
            embed.addField(`\u200b`, `Queue is empty`);
        }
        
        for(let i = start; i < end; i++){
            if(i == currentIndex){
                embed.addField(`\u200b`, `**-----> #${i + 1}**:` + "```css\n" + `[${songs[i].name}] - ${songs[i].duration}` + "\n```");
            }else{
                embed.addField(`\u200b`, `**#${i + 1}**: ${songs[i].name} - ${songs[i].duration}`);
            }
        }
        
        msg.channel.send(embed);
    }


    public showCurrentSong(msg: Discord.Message, song: Song, currentIndex: number, currentSeconds: number){
        
        const percent: number = Math.round((currentSeconds / song.seconds) * 40);
        let percentStr: string = "";

        for(let i = 1; i <= percent; i++)   { percentStr += '#'}
        for(let i = percent; i <= 40; i ++) { percentStr += '='}

        const embed: Discord.MessageEmbed = new MessageEmbed();

        // embed.setColor('#A84300');
        // embed.setTitle(`Current song`);
        // embed.addField(`#${currentIndex + 1}: ${song.name}`, `${percentStr} [${TimeFormatter.formatSeconds(currentSeconds)} / ${song.duration}]`);
        // embed.setThumbnail(song.thumbnail);

        msg.channel.send(embed);
    }

}