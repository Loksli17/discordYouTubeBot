import Discord from 'discord.js';
import ytdl    from 'ytdl-core';

export interface Song{
    link    : string;
    duration: string;
    name    : string;
}


export default class MusicGuild{

    public static isPlaying   : boolean     = false;
    private       queue_       : Array<Song> = [];
    public static currentIndex: number      = 0;
    public static connection  : Discord.VoiceConnection | undefined | void;

    public addSong(song: Song): void{
        this.queue_.push(song);
    }

    public nextSong(): Song | undefined{
        if(MusicGuild.currentIndex + 1 == this.queue_.length) return undefined;
        MusicGuild.currentIndex++;
        return this.queue_[MusicGuild.currentIndex];
    }

    public prevSong(): Song | undefined{
        if(MusicGuild.currentIndex - 1 == -1) return undefined;
        MusicGuild.currentIndex--;
        return this.queue_[MusicGuild.currentIndex];
    }

    //! here bad way
    public currentSong(): Song | undefined{
        if(MusicGuild.currentIndex - 1 == 0) return undefined;
        return this.queue_[MusicGuild.currentIndex];
    }

    public get queue(): Array<Song>{
        return this.queue_;
    }


    public play(song: Song, msg: Discord.Message): void{

        if(MusicGuild.connection == undefined) return;
        
        const dispatcher: Discord.StreamDispatcher = MusicGuild.connection!.play(ytdl(song.link), {highWaterMark: 1024 * 1024 * 10});

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
                MusicGuild.currentIndex++; //! it can be ERORR ATTENTION
                return;
            }

            this.play(nextSong, msg);    
        });
    }
}