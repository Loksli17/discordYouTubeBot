import Discord, { BitField, Client }   from 'discord.js'
import config                from './config';
import configChipher         from './config/configChipher';
import Bot                   from './Bot/Bot';


export default class ClientAdapter {

    private client: Client = new Discord.Client();

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
        this.client.on('message', async (msg: Discord.Message) => {

            if(msg.author.username == this.client.user?.username || this.client.user?.discriminator == msg.author.discriminator) {
                console.error('error with user');
                // todo send error message !
                return;
            }

            const bot: Bot = new Bot(msg);

            const checkPrefixResult: boolean = bot.checkPrefix();

            if(!checkPrefixResult){
                console.error('error this prefix');
                //todo send error message
            }

            try {
                await bot.execute();
            } catch (error) {
                //todo send error message
                console.error(error);
            }
        });
    }

    public login(): void { this.client.login(configChipher.token); }
}