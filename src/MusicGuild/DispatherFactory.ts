import Discord             from 'discord.js';
import MessageEmbedAdapter from '../utils/MessageEmbedAdapter';

export default class DispatherFactory {

    private static messageEmded: MessageEmbedAdapter = new MessageEmbedAdapter();


    public static execute(connection: Discord.VoiceConnection): Discord.StreamDispatcher {

        let dispatcher: Discord.StreamDispatcher | undefined = connection?.dispatcher;
        
        if(dispatcher == undefined){
            // this.messageEmded.dispatcherProblem(this.discordMessage);
            throw new Error('Probrem with dispatcher');
        }

        dispatcher

        return dispatcher;
    }
}