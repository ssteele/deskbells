import { Version } from './version.js';

export class Song {
    id = '';
    name = '';
    versions = [
        new Version(),
    ];

    constructor(obj) {
        Object.assign(this, obj);
    };
};
