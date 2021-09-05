import { Version } from './version.js';

export class Song {
    id = '';
    isActive = true;
    name = '';
    versions = [
        new Version(),
    ];

    constructor(obj) {
        Object.assign(this, obj);
    };
};
