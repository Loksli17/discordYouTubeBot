import config  from './config';
import Discord from 'discord.js';


export interface Command{
    name : string;
    out  : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => void;
    about: string;
}

const commands: Array<Command> = [
    {
        name: 'play',
        out : (bot: Discord.Client, msg: Discord.Message, words: Array<string>) => {
            msg.channel.send('AHAHAHAH HAHA Ha HAHAH HA');
        },
        about: 'Command for play youtube video',
    },
];

export default commands;