"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimeFormatter {
    static formatDuration(duration) {
        let min = '', sec = '', hou = '';
        let result = duration.match(/\d+H/g);
        hou = result != null ? result[0] : '00';
        if (hou.length == 2)
            hou = "0" + hou;
        hou = hou.substr(0, 2);
        result = duration.match(/\d+M/g);
        min = result != null ? result[0] : '00';
        if (min.length == 2)
            min = "0" + min;
        min = min.substr(0, 2);
        result = duration.match(/\d+S/g);
        sec = result != null ? result[0] : '00';
        if (sec.length == 2)
            sec = "0" + sec;
        sec = sec.substr(0, 2);
        return {
            duration: `${hou}:${min}:${sec}`,
            seconds: Number(hou) * 3600 + Number(min) * 60 + Number(sec)
        };
    }
    static formatSeconds(curSec) {
        let min = Math.floor(curSec / 60), h = Math.floor(curSec / 3600), sec = curSec - min * 60;
        let minStr = min.toString(), hStr = h.toString(), secStr = sec.toString();
        if (hStr.length == 1)
            hStr = "0" + hStr;
        if (minStr.length == 1)
            minStr = "0" + minStr;
        if (secStr.length == 1)
            secStr = "0" + secStr;
        return `${hStr}:${minStr}:${secStr}`;
    }
}
exports.default = TimeFormatter;
