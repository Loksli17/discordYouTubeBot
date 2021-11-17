import Discord, { MessageEmbed }  from 'discord.js';
import {google, youtube_v3}       from 'googleapis';
import { GaxiosResponse }         from 'gaxios';
import MusicGuild, { Song }       from './MusicGuild';
import configChipher              from './configChipher';


const youtube: youtube_v3.Youtube = google.youtube({
    auth   : configChipher.youtubeKey,
    version: 'v3'
});

const musicGuild = new MusicGuild();

export interface Command{
    name   : string;
    out    : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => void;
    about  : string;
}



const commands: Array<Command> = [
    {
        name : 'play',
        about: 'Command for play youtube video',

        out : async (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {

            let
                channel   : Discord.VoiceChannel | null = msg.member!.voice.channel,
                link      : string                      = 'https://www.youtube.com/watch?v=',
                videoName : string                      = '',
                data      : GaxiosResponse | void       = undefined,
                connection: Discord.VoiceConnection | undefined | void;

            data = await youtube.search.list({ part: ['snippet'], q: words.join(' '), maxResults: 1 }).catch(error => console.error(error));

            if(data == undefined) { msg.reply('Error with Google API'); return }

            link += data.data.items[0].id.videoId;
            videoName = data.data.items[0].snippet.title;
            msg.channel.send(link);

            const durationData: any = await youtube.videos.list({
                "part": [
                    "contentDetails, snippet"
                ],
                "id": [
                    data.data.items[0].id.videoId,
                ]
            }).catch(error => console.error(error));

            let {duration, seconds} = musicGuild.formatDuration(durationData.data.items[0].contentDetails.duration);

            let song: Song = {
                link     : link,
                duration : duration,
                name     : videoName,
                seconds  : seconds,
                thumbnail: durationData.data.items[0].snippet.thumbnails.default.url
            };

            musicGuild.addSong(song);

            if(!MusicGuild.hasMusic){

                MusicGuild.hasMusic = true;
                connection = await channel?.join().catch(error => console.error(error));

                if(connection == undefined) { msg.reply('Error with connection'); return; }

                MusicGuild.connection = connection;
                musicGuild.play(song, msg);
            }
 
        }, 
    },

    {
        name : 'pause',
        about: 'Command for pause audio',
        out  : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {
            musicGuild.pause(msg);
        }
    },

    {
        name : 'resume',
        about: 'Command for continue audio',
        out  : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {
            musicGuild.resume(msg);
        }
    },

    {
        name : 'prev',
        about: 'Command for pause audio',
        out  : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {
            let song: Song | undefined = musicGuild.prevSong();
            if(song == undefined) { msg.reply('No songs'); return; }
            musicGuild.play(song, msg);
        }
    },
 
    {
        name : 'next',
        about: 'Command for pause audio',
        out  : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {
            let song: Song | undefined = musicGuild.nextSong();
            if(song == undefined) { 
                MusicGuild.currentIndex++;
                msg.reply('No more songs');
                musicGuild.pause(msg);
                return; 
            }
            musicGuild.play(song, msg);
        }
    },

    {
        name : 'current',
        about: 'Command for send current audio',
        out: (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {
            let song: Song | undefined = musicGuild.currentSong();
            if(song == undefined) { msg.reply('No more songs'); return; }

            const percent: number = Math.round((MusicGuild.currentSeconds / song.seconds) * 40);
            let percentStr: string = "";

            for(let i = 1; i <= percent; i++)   { percentStr += '#'}
            for(let i = percent; i <= 40; i ++) { percentStr += '='}

            const embed: Discord.MessageEmbed = new MessageEmbed();

            embed.setColor('#A84300');
            embed.setTitle(`Current song`);
            embed.addField(`#${MusicGuild.currentIndex + 1}: ${song.name}`, `${percentStr} [${musicGuild.formatSeconds(MusicGuild.currentSeconds)} / ${song.duration}]`);
            embed.setThumbnail(song.thumbnail);

            msg.channel.send(embed);
        },
    },

    {
        name : 'queue', 
        about: 'Command for send qeueu',
        out: (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {

            let
                embed  : Discord.MessageEmbed = new MessageEmbed(),
                songs  : Array<Song> = musicGuild.queue,
                start  : number      = (MusicGuild.currentIndex - 4) > 0 ? MusicGuild.currentIndex - 4    : 0,
                end    : number      = MusicGuild.currentIndex + 5 > songs.length          ? songs.length : MusicGuild.currentIndex + 5;

            embed.setColor('#A84300');
            embed.setTitle('Queue');
            
            for(let i = start; i < end; i++){
                if(i == MusicGuild.currentIndex){
                    embed.addField(`\u200b`, `**-----> #${i + 1}**:` + "```css\n" + `[${songs[i].name}] - ${songs[i].duration}` + "\n```");
                }else{
                    embed.addField(`\u200b`, `**#${i + 1}**: ${songs[i].name} - ${songs[i].duration}`);
                }
            }
            
            msg.channel.send(embed);
        },
    },

    {
        name : 'remove',
        about: 'Removing song from queue',
        out: (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {

            const index: number = Number(words[1]);

            if(Number.isNaN(index)){
                const embed: Discord.MessageEmbed = new MessageEmbed();
                embed.setColor('#A84300');
                embed.setTitle("Unexpected index of song's queue");
                embed.setDescription(`Index must be from **1** to **${musicGuild.queue.length}**`);
                msg.channel.send(embed);
                return;
            }

            const embed: Discord.MessageEmbed = new MessageEmbed();
            embed.setColor('#A84300');
            embed.setTitle("Successful removing");
            embed.setDescription(`Song: **${musicGuild.queue[index - 1].name}** was removed`);
            msg.channel.send(embed);

            musicGuild.queue = musicGuild.queue.filter((song: Song, songInd: number) => songInd != index - 1);
        },
    }
];

export default commands;