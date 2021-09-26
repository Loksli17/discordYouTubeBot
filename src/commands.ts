import config   from './config';
import Discord, { MessageEmbed }  from 'discord.js';
import {google, youtube_v3} from 'googleapis';
import ytdl from 'ytdl-core';
import { GaxiosResponse } from 'gaxios';
import MusicGuild, { Song } from './MusicGuild';
import { codeBlock } from '@discordjs/builders';
import configChipher from './configChipher';
// @ts-ignore
// import Youtube from 'simple-youtube-api';


const youtube: youtube_v3.Youtube = google.youtube({
    auth   : configChipher.youtubeKey,
    version: 'v3'
});

const musicGuild = new MusicGuild();

export interface Command{
    name : string;
    out  : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => void;
    about: string;
}



const commands: Array<Command> = [
    {
        name : 'play',
        about: 'Command for play youtube video',


        // ! don't forget about try catch
        out : async (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {

            let
                channel   : Discord.VoiceChannel | null = msg.member!.voice.channel,
                link      : string                      = 'https://www.youtube.com/watch?v=',
                videoName : string                      = '',
                data      : GaxiosResponse | void       = undefined,
                connection: Discord.VoiceConnection | undefined | void;

            data = await youtube.search.list({ part: ['snippet'], q: words.join(' '), maxResults: 1 }).catch(error => console.error(error));

            if(data == undefined) { msg.reply('Error with Google API'); return }

            //! add checking here

            link += data.data.items[0].id.videoId;
            videoName = data.data.items[0].snippet.title;
            msg.channel.send(link);

            let song: Song = {
                link    : link,
                duration: '00:00',
                name    : videoName,
            };

            musicGuild.addSong(song);

            if(!MusicGuild.isPlaying){

                MusicGuild.isPlaying = true;
                connection = await channel?.join().catch(error => console.error(error));

                if(connection == undefined) { msg.reply('Error with connection'); return; }

                MusicGuild.connection = connection;
                // musicGuild.play(song, msg);
            }
 
        }, 
    },

    {
        name : 'pause',
        about: 'Command for pause audio',
        out  : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {

        }
    },

    // ! fix this
    {
        name : 'prev',
        about: 'Command for pause audio',
        out  : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {
            let song: Song | undefined = musicGuild.prevSong();
            if(song == undefined) { msg.reply('No songs'); return; }
            musicGuild.play(song, msg);
        }
    },

    // ! fix this
    {
        name : 'next',
        about: 'Command for pause audio',
        out  : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {
            let song: Song | undefined = musicGuild.nextSong();
            if(song == undefined) { msg.reply('No more songs'); return; }
            musicGuild.play(song, msg);
        }
    },

    {
        name : 'current',
        about: 'Command for send current audio',
        out: (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {
            let song: Song | undefined = musicGuild.currentSong();
            if(song == undefined) { msg.reply('No more songs'); return; }

            const embed: Discord.MessageEmbed = new MessageEmbed();

            embed.setColor('#A84300');
            embed.setTitle(`Current song`);
            embed.addField(`#${MusicGuild.currentIndex + 1}: ${song.name}`, "########------------");

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

            const index: number = Number(words[0]);

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