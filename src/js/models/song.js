export class Song {
    id = '';
    name = '';
    lines = [
        {
            notes: [],
            lyrics: ['No valid transpositions for selected instrument'],
        },
    ];

    constructor(obj) {
        Object.assign(this, obj);
    };
};
