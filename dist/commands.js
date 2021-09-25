"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const youtube = googleapis_1.google.youtube({
    auth: 'AIzaSyCMJGB1MaBgoN78v8PkmuMEJOLs6_CYHME',
    version: 'v3'
});
const commands = [
    {
        name: 'play',
        out: (bot, msg, words) => {
            console.log(words.join(' '));
            youtube.search.list({ part: ['snippet'], q: words.join(' '), maxResults: 1 }, (error, data) => {
                console.log(error);
                console.log(data.data.items);
                msg.channel.send(`https://www.youtube.com/watch?v=${data.data.items[0].id.videoId}`);
            });
        },
        about: 'Command for play youtube video',
    },
];
exports.default = commands;
