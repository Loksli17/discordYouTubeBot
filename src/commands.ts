import config   from './config';
import Discord  from 'discord.js';
import {google, youtube_v3} from 'googleapis';
import ytdl from 'ytdl-core';
import { GaxiosResponse } from 'gaxios';
import MusicGuild, { Song } from './MusicGuild';

const youtube: youtube_v3.Youtube = google.youtube({
    auth   : 'AIzaSyCMJGB1MaBgoN78v8PkmuMEJOLs6_CYHME',
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

        out : async (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {

            let
                channel   : Discord.VoiceChannel | null = msg.member!.voice.channel,
                link      : string                      = 'https://www.youtube.com/watch?v=',
                videoName : string                      = '',
                data      : GaxiosResponse | void,
                connection: Discord.VoiceConnection | undefined | void;

            data = await youtube.search.list({ part: ['snippet'], q: words.join(' '), maxResults: 1 }).catch(error => console.error(error));

            if(data == undefined) { msg.reply('Error with Google API'); return;}

            link += data.data.items[0].id.videoId;
            videoName = data.data.items[0].snippet.title;
            msg.channel.send(`https://www.youtube.com/watch?v=${data.data.items[0].id.videoId}`);

            musicGuild.addSong({
                link: link,
                duration: '00:00',
                name: videoName,
            });

            if(!MusicGuild.isPlaying){

                MusicGuild.isPlaying = true;
                connection = await channel?.join().catch(error => console.error(error));

                if(connection == undefined){ msg.reply('Error with connection'); return; }

                musicGuild.play(connection, msg);

                // let dispatcher: Discord.StreamDispatcher = connection.play(ytdl(link), {highWaterMark: 1024 * 1024 * 10});

                // dispatcher.on('start', () => {
                //     msg.channel.send(`--- Now playing ${videoName} ---`);
                // });

                // dispatcher.on('finish', () => {
                //     msg.channel.send(`--- End playing of ${videoName} ---`);

                //     const song: Song | undefined = musicGuild.nextSong();
                    
                //     if(song == undefined){
                //         //leave
                //         msg.channel.send(`--- No more songs !! ---`);
                //         return;
                //     }

                //     // connection.play(ytdl(song.link), {highWaterMark: 1024 * 1024 * 10});
                    
                // });
            }
 
        }, 
    },

    {
        name : 'pause',
        about: 'Command for pause audio',
        out  : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {

        }
    },

    {
        name : 'prev',
        about: 'Command for pause audio',
        out  : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {

        }
    },

    {
        name : 'next',
        about: 'Command for pause audio',
        out  : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {

        }
    },

    {
        name : 'current',
        about: 'Command for send current audio',
        out: (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {
            msg.channel.send('Now playing smth');
        },
    },

    {
        name : 'queue', 
        about: 'Command for send qeueu',
        out: (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {
            msg.channel.send(`${['ahaha', 'ahah', 'haha']}`);
        },
    }
];

export default commands;