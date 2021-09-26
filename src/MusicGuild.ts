import Discord from 'discord.js';
import ytdl    from 'ytdl-core';

export interface Song{
    link    : string;
    duration: string;
    name    : string;
    seconds : number;
}


export default class MusicGuild{

    public static  isPlaying     : boolean     = false;
    private        queue_        : Array<Song> = [];
    public static  currentIndex  : number      = 0;
    public static  currentSeconds: number = 0;
    public static  connection    : Discord.VoiceConnection | undefined | void;
    private static interval      : NodeJS.Timeout;
 
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
        return this.queue_[MusicGuild.currentIndex];
    }

    public get queue(): Array<Song>{
        return this.queue_;
    }

    public set queue(newVal: Array<Song>){
        this.queue_ = newVal;
    }


    public play(song: Song, msg: Discord.Message): void{

        if(MusicGuild.connection == undefined) return;
        
        try {
            const dispatcher: Discord.StreamDispatcher = MusicGuild.connection!.play(ytdl(song.link), {highWaterMark: 1024 * 1024 * 10});

            dispatcher.on('start', () => {
                msg.channel.send(`--- Now playing ${song.name} ---`);

                MusicGuild.currentSeconds = 0;
                MusicGuild.interval = setInterval(() => {
                    MusicGuild.currentSeconds++;
                }, 1000)
            });

            dispatcher.on('finish', () => {
                msg.channel.send(`--- End playing of ${song.name} ---`);

                const nextSong: Song | undefined = this.nextSong();
                
                if(nextSong == undefined){
                    // !leave
                    msg.channel.send(`--- No more songs !! ---`);
                    MusicGuild.isPlaying = false;
                    MusicGuild.currentIndex++;
                    return;
                }

                this.play(nextSong, msg);    
            });
        } catch (error) {
            console.error(error);
        }
        
    }

    
    public formatDuration(duration: string): {duration: string; seconds: number} {

        let 
            min: string = '',
            sec: string = '',
            hou: string = '';

        let result: RegExpMatchArray | null = duration.match(/\d+H/g);
        hou = result != null ? result[0] : '00';
        if(hou.length == 2) hou = "0" + hou;
        hou = hou.substr(0, 2);

        result = duration.match(/\d+M/g);
        min = result != null ? result[0] : '00';
        if(min.length == 2) min = "0" + min;
        min = min.substr(0, 2);

        result = duration.match(/\d+S/g);
        sec = result != null ? result[0] : '00';
        if(sec.length == 2) sec = "0" + sec;
        sec = sec.substr(0, 2);
        
        return {
            duration: `${hou}:${min}:${sec}`,
            seconds : Number(hou) * 3600 + Number(min) * 60 + Number(sec) 
        };
    }


    public formatSeconds(curSec: number): string{

        let 
            min: number = Math.floor(curSec / 60),
            h  : number = Math.floor(curSec / 3600),
            sec: number = curSec - min * 60;

        let
            minStr: string = min.toString(),
            hStr  : string = h.toString(),
            secStr: string = sec.toString();

        if(hStr.length == 1) hStr = "0" + hStr;
        if(minStr.length == 1) minStr = "0" + minStr;
        if(secStr.length == 1) secStr = "0" + secStr;

        return `${hStr}:${minStr}:${secStr}`;
    }

}