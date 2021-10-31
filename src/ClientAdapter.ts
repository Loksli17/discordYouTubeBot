import Discord, { Client }   from 'discord.js'
import config                from './config';
import configChipher         from './config/configChipher';
import commands, { Command } from './commands';


export default class ClientAdapter {

    private client: Client = new Discord.Client();
    private key   : string = ""

    constructor() { }

    public start(): void {
        this.ready();
        this.message();
        this.login();
    }


    public ready(): void{
        this.client.on('ready', () => console.log('I am working!'));
    }

    public message(): void {
        this.client.on('message', (msg: Discord.Message) => {

            if(msg.author.username == this.client.user?.username || this.client.user?.discriminator == msg.author.discriminator) {
                // todo send error message !
                return;
            }

            let
                reg      : RegExp                  = new RegExp(`^${config.prefix}`, 'g'),
                resultArr: RegExpMatchArray | null = msg.content.match(reg),
                prefix   : string                  = resultArr == null ? "" : resultArr[0];

            if(prefix != config.prefix) return;
            msg.content.replace(prefix, '');

            let
                words          : Array<string> = msg.content.split(" "),
                userCommandName: string        = words[1];

            words = words.filter((value, ind) => ind > 0); //* removing command
            
            commands.forEach((command: Command) => {
                if(command.name == userCommandName) command.out(this.client, msg, words);
            });

        });
    }

    public login(): void { this.client.login(configChipher.token); }
}