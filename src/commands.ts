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

        out : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {

            let channel = msg.member!.voice.channel;

            youtube.search.list({ part: ['snippet'], q: words.join(' '), maxResults: 1 }, (error: any, data: any) => {
                console.log(error);
                msg.channel.send(`https://www.youtube.com/watch?v=${data.data.items[0].id.videoId}`);

                console.log(data.data.items[0].snippet.title);
                
                channel?.join().then(async (connection: Discord.VoiceConnection) => {
            
                    const playing = connection.play(ytdl(`https://www.youtube.com/watch?v=${data.data.items[0].id.videoId}`, {quality: 'highestaudio'}));

                    playing.on('finish', () => {
                        msg.channel.send('video end');
                    });
                })
            });
        },

        about: 'Command for play youtube video',
    },
];

export default commands;