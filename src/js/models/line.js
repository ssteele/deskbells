export class Line {
    notes = [];
    chords = [];
    lyrics = ['No valid transpositions for selected instrument'];

    constructor(obj) {
        Object.assign(this, obj);
    };
};
