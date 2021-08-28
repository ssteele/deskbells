import { Line } from './line.js';

export class Version {
    id = '';
    level = 1;
    lines = [
        new Line(),
    ];
    name = '';

    constructor(obj) {
        Object.assign(this, obj);
    };
};
