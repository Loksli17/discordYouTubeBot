import { google, sts_v1, youtube_v3 } from 'googleapis';
import configChipher          from '../config/configChipher';
import Song                   from './Song';
import { GaxiosResponse }     from 'gaxios';
import TimeFormatter          from './TimeFormatter';


export default class YouTubeAdapter {

    private youtube: youtube_v3.Youtube = google.youtube({
        auth   : configChipher.youtubeKey,
        version: 'v3'
    });

    public async searchSong(words: Array<string>): Promise<Song>{
        
        let 
            song        : Song                  = new Song(),
            videoName   : string                = '',
            thumbnail   : string                = '',
            link        : string                = 'https://www.youtube.com/watch?v=',
            durationData: any                   = undefined,
            data        : GaxiosResponse | void = undefined;

        data = await this.youtube.search.list({ part: ['snippet'], q: words.join(' '), maxResults: 1 }).catch(error => console.error(error));

        if(data == undefined) { throw new Error(); }

        durationData = await this.youtube.videos.list({
            "part": [
                "contentDetails, snippet"
            ],
            "id": [
                data.data.items[0].id.videoId,
            ]
        }).catch(error => console.error(error));

        link      += data.data.items[0].id.videoId;
        videoName = data.data.items[0].snippet.title;
        thumbnail = durationData.data.items[0].snippet.thumbnails.default.url;


        let { duration, seconds } = TimeFormatter.formatDuration(durationData.data.items[0].contentDetails.duration);

        song.setDuration(duration).setLink(link).setName(videoName).setSeconds(seconds).setThumbnail(thumbnail);
        
        return song;
    }
}