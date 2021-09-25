import config              from './config';
import Discord, {Intents}  from 'discord.js'
import commands, {Command} from './commands';
import configChipher       from './configChipher';

const main = () => {

    const 
        intents: Array<number>  = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
        bot    : Discord.Client = new Discord.Client();

    bot.on('ready', () => console.log('I am working!'));

    bot.on('message', (msg: Discord.Message) => {
        
        if(msg.author.username == bot.user?.username || bot.user?.discriminator == msg.author.discriminator) return;

        if(msg.content[0] != config.prefix) return;


        //! FIX THIS SHIT !!!
        let
            words          : Array<string> = msg.content.split(" "),
            userCommandName: string        = words[0].substr(1, words[0].length);

        words = words.filter((value, ind) => ind > 0);
        
        commands.forEach((command: Command) => {
            if(command.name == userCommandName) command.out(bot, msg, words);
        });
    });

    bot.login(configChipher.token);
}

main();



