"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Song {
    constructor() {
        this.link = "";
        this.duration = "";
        this.name = "";
        this.seconds = 0;
        this.thumbnail = "";
    }
    setLink(link) {
        this.link = link;
        return this;
    }
    setDuration(duration) {
        this.duration = duration;
        return this;
    }
    setName(name) {
        this.name = name;
        return this;
    }
    setSeconds(seconds) {
        this.seconds = seconds;
        return this;
    }
    setThumbnail(thumbnail) {
        this.thumbnail = thumbnail;
        return this;
    }
}
exports.default = Song;
