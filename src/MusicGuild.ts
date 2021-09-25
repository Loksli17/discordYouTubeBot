import Discord from 'discord.js';
import ytdl    from 'ytdl-core';

export interface Song{
    link    : string;
    duration: string;
    name    : string;
}


export default class MusicGuild{

    public static isPlaying   : boolean     = false;
    private       queue       : Array<Song> = [];
    public static currentIndex: number      = 0;

    public addSong(song: Song): void{
        this.queue.push(song);
    }

    public nextSong(): Song | undefined{
        if(MusicGuild.currentIndex + 1 == this.queue.length) return undefined;
        MusicGuild.currentIndex++;
        return this.queue[MusicGuild.currentIndex];
    }

    public prevSong(): Song | undefined{
        if(MusicGuild.currentIndex - 1 == 0) return undefined;
        MusicGuild.currentIndex--;
        return this.queue[MusicGuild.currentIndex];
    }

    public play(connection: Discord.VoiceConnection, msg: Discord.Message): void{
        
        const
            song      : Song                     = this.queue[MusicGuild.currentIndex],
            dispatcher: Discord.StreamDispatcher = connection.play(ytdl(song.link), {highWaterMark: 1024 * 1024 * 10});

        dispatcher.on('start', () => {
            msg.channel.send(`--- Now playing ${song.name} ---`);
        });

        dispatcher.on('finish', () => {
            msg.channel.send(`--- End playing of ${song.name} ---`);

            const nextSong: Song | undefined = this.nextSong();
            
            if(nextSong == undefined){
                //leave
                msg.channel.send(`--- No more songs !! ---`);
                MusicGuild.isPlaying = false;
                return;
            }

            this.play(connection, msg);

            // connection.play(ytdl(song.link), {highWaterMark: 1024 * 1024 * 10});
            
        });
    }
}