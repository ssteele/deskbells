export class Song {
    id = '';
    name = '';
    lines = [
        {
            notes: [],
            lyrics: [],
        },
    ];

    constructor(obj) {
        Object.assign(this, obj);
    };
};
