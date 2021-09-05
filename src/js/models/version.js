import { Line } from './line.js';

export class Version {
    name = '';
    id = '';
    isActive = true;
    level = 1;
    lines = [
        new Line(),
    ];

    constructor(obj) {
        Object.assign(this, obj);
    };
};
