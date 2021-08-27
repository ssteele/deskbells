import { Line } from './line.js';

export class Song {
    id = '';
    name = '';
    levels = [
        {
            level: 1,
            lines: [
                new Line(),
            ],
        },
    ];

    constructor(obj) {
        Object.assign(this, obj);
    };
};
