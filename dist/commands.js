"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands = [
    {
        name: 'test',
        out: (bot, msg, words) => {
            msg.channel.send('AHAHAHAH HAHA Ha HAHAH HA');
        },
        about: 'Test command',
    },
];
exports.default = commands;
