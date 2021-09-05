export class Line {
    chords = [];
    notes = [];
    lyrics = ['No valid transpositions for selected instrument'];

    constructor(obj) {
        Object.assign(this, obj);
    };
};
