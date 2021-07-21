export class Instrument {
    id = '';
    name = '';
    notesMap = [
        {
            index: 0,
            note: 'rest',
        },
    ];

    constructor(obj) {
        Object.assign(this, obj);
    };
};
