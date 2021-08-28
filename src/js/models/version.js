import { Line } from './line.js';

export class Version {
    id = '';
    level = 1;
    lines = [
        new Line(),
    ];

    constructor(obj) {
        Object.assign(this, obj);
    };
};
