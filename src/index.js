
const songId = 'asserin-asseran';
const songs = [
    {
        id: 'asserin-asseran',
        name: 'Asserin Asseran',
        notes: [
            [1, 1, 4, 0, 1, 1, 6],
            [1, 1, 2, 1, 2, 3, 4],
        ],
    },
];
const song = songs.find((s) => {
    return s.id === songId;
});
const bells = [
    {
        color: null,
        index: 0,
        note: null,
    },
    {
        color: 'f00',
        index: 1,
        note: 'c',
    },
    {
        color: 'ffa500',
        index: 2,
        note: 'd',
    },
    {
        color: 'ff0',
        index: 3,
        note: 'e',
    },
    {
        color: '7cfc00',
        index: 4,
        note: 'f',
    },
    {
        color: '088',
        index: 5,
        note: 'g',
    },
    {
        color: '4b0082',
        index: 6,
        note: 'a',
    },
    {
        color: 'f0f',
        index: 7,
        note: 'b',
    },
    {
        color: 'f00',
        index: 8,
        note: 'c',
    },
];
const notes = document.getElementById('notes');

createLineElement = () => {
    const el = document.createElement('div');
    el.classList.add('line');
    return el;
};

createBellElement = (bell) => {
    const el = document.createElement('div');
    el.classList.add('circle', bell.note);
    return el;
};

renderNote = (lineEl, bells, index = 1) => {
    const bell = bells.find((b) => {
        return b.index === index;
    })
    return notes.append(createBellElement(bell));
};

renderLine = () => {
    return notes.append(createLineElement());
};

renderSong = (song) => {
    for (let lines of song) {
        const lineEl = renderLine();
        let note;
        if (!Array.isArray(lines)) {
            note = lines;
            renderNote(lineEl, bells, note);
        } else {
            for (note of lines) {
                renderNote(lineEl, bells, note);
            }
        }
    }
};

renderSong(song.notes);
