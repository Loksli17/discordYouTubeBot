import config   from './config';
import Discord  from 'discord.js';
import {google, youtube_v3} from 'googleapis';
import ytdl from 'ytdl-core';

const youtube: youtube_v3.Youtube = google.youtube({
    auth   : 'AIzaSyCMJGB1MaBgoN78v8PkmuMEJOLs6_CYHME',
    version: 'v3'
});

export interface Command{
    name : string;
    out  : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => void;
    about: string;
}


const commands: Array<Command> = [
    {
        name: 'play',

        //! REFACTOR THIS BEFORE ANOTHER CODING !!!!!!
        out : async (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {

            let channel = msg.member!.voice.channel;

            youtube.search.list({ part: ['snippet'], q: words.join(' '), maxResults: 1 }, (error: any, data: any) => {
                console.log(error);
                msg.channel.send(`https://www.youtube.com/watch?v=${data.data.items[0].id.videoId}`);

                console.log(data.data.items[0].snippet.title);
                
                channel?.join().then(async (connection: Discord.VoiceConnection) => {
            
                    const dispatcher = connection.play(ytdl(`https://www.youtube.com/watch?v=${data.data.items[0].id.videoId}`, {
                        highWaterMark: 1024 * 1024 * 10
                    }))
                    .on('start', () => {
                        msg.channel.send(`--- Now playing ${data.data.items[0].snippet.title} ---`);
                    })
                    .on('finish', () => {
                        msg.channel.send(`--- End playing of ${data.data.items[0].snippet.title} ---`);
                    });
                })
            });
        },

        about: 'Command for play youtube video',
    },

    {
        name: 'current',

        out: (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {
            msg.channel.send('Now playing smth');
        },

        about: 'Command for send current audio',
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