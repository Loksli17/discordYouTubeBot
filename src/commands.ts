import config   from './config';
import Discord  from 'discord.js';
import {google, youtube_v3} from 'googleapis';

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

            console.log(words.join(' '));

            youtube.search.list({ part: ['snippet'], q: words.join(' '), maxResults: 1 }, (error: any, data: any) => {
                console.log(error);
                console.log(data.data.items);
                msg.channel.send(`https://www.youtube.com/watch?v=${data.data.items[0].id.videoId}`);
            });
            
        },
        about: 'Command for play youtube video',
    },
];

export default commands;