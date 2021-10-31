interface SongProps {
    link     : string;
    duration : string;
    name     : string;
    seconds  : number;
    thumbnail: string;
}


export default class Song implements SongProps{

    public link     : string = "";
    public duration : string = "";
    public name     : string = "";
    public seconds  : number = 0;
    public thumbnail: string = "";

    constructor() { }

    public setLink(link: string): Song {
        this.link = link;
        return this;
    }

    public setDuration(duration: string): Song {
        this.duration = duration;
        return this;
    }

    public setName(name: string): Song {
        this.name = name;
        return this;
    }

    public setSeconds(seconds: number): Song {
        this.seconds = seconds;
        return this;
    }

    public setThumbnail(thumbnail: string): Song {
        this.thumbnail = thumbnail;
        return this;
    }
}