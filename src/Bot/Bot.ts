import commands    from "../config/command";
import { Message } from 'discord.js';
import config      from '../config';
import BotCommands from "./BotCommands";


export default class Bot extends BotCommands{

    constructor(msg: Message){ super(msg); }

    public async execute(): Promise<void> {

        let 
            words      : Array<string> = this.msg.toString().split(' '),
            commandName: string        = words[1];
        
        this.words = words;

        if(!commands.includes(commandName)) {
            throw new Error('Bad command');
        }
    
        switch(commandName){
            case 'play':
                await this.play();
                break;
            case 'pause':
                this.pause();
                break;
            case 'resume':
                this.resume();
                break;
            case 'prev':
                this.prev();
                break;
            case 'next':
                this.next();
                break;
            case 'current':
                this.current();
                break;
            case 'queue':
                this.queue();
                break;
            case 'remove':
                this.remove();
                break;
            case 'remove':
                this.remove();
                break;
            case 'sayAhaha':
                this.remove();
                break;
            case 'playAhaha':
                this.remove();
                break;

        }  
    }


    public checkPrefix(): boolean {
        let
            reg      : RegExp                  = new RegExp(`^${config.prefix}`, 'g'),
            resultArr: RegExpMatchArray | null = this.msg.content.match(reg),
            prefix   : string                  = resultArr == null ? "" : resultArr[0];

        if(prefix != config.prefix) return false;
        this.msg.content.replace(prefix, '');

        return true;
    }
}