import config              from './config';
import Discord             from 'discord.js'
import commands, {Command} from './commands';
import configChipher       from './configChipher';


const main = () => {

    const bot: Discord.Client = new Discord.Client();

    bot.on('ready', () => console.log('I am working!'));

    bot.on('message', (msg: Discord.Message) => {
        
        if(msg.author.username == bot.user?.username || bot.user?.discriminator == msg.author.discriminator) return;

        //! FIX THIS SHIT !!!
        let
            reg            : RegExp                  = new RegExp(`^${config.prefix}`, 'g'),
            resultArr      : RegExpMatchArray | null = msg.content.match(reg),
            prefix         : string                  = resultArr == null ? "" : resultArr[0],
            words          : Array<string>           = msg.content.split(" "),
            userCommandName: string                  = words[0].substr(1, words[0].length);

        if(prefix != config.prefix) return;

        words = words.filter((value, ind) => ind > 0);
        
        commands.forEach((command: Command) => {
            if(command.name == userCommandName) command.out(bot, msg, words);
        });
    });

    bot.login(configChipher.token);
}

main();



