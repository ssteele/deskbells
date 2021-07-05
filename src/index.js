
const notes = document.getElementById('notes');
const bells = [
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

createBellElement = (bell) => {
    const el = document.createElement('div');
    el.classList.add('circle', bell.note);
    return el;
}

renderNote = (bells, index = 1) => {
    const bell = bells.find((b) => {
        return b.index === index;
    })
    notes.append(createBellElement(bell));
}

renderNote(bells, 1);
renderNote(bells, 1);
renderNote(bells, 4);