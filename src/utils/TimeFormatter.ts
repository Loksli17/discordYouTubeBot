

export default class TimeFormatter {

    public static formatDuration(duration: string): {duration: string; seconds: number} {

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

    public static formatSeconds(curSec: number): string{

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