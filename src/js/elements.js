export const createLineElement = () => {
    const el = document.createElement('div');
    el.classList.add('line');
    return el;
};

export const createNoteElement = (note) => {
    const el = document.createElement('div');
    el.classList.add('note', note);
    return el;
};

export const createChordElement = (notes = []) => {
    if (!Array.isArray(notes)) {
        createNoteElement(notes);
    }
    const el = document.createElement('div');
    el.classList.add('note', `v-space-${notes.length - 1}`, notes[0]);
    for (let i=1 ; i<notes.length ; i++) {
        const childEl = document.createElement('div');
        childEl.classList.add('note', 'chord', notes[i]);
        el.appendChild(childEl);
    }
    return el;
};

export const createLyricElement = (text = null) => {
    const el = document.createElement('div');
    el.classList.add('lyric');
    el.innerHTML = text || '&nbsp;';
    return el;
};
