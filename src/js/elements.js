export const createLineElement = () => {
    const el = document.createElement('div');
    el.classList.add('line');
    return el;
};

const createChordElement = (chord) => {
    const el = document.createElement('span');
    el.appendChild(document.createTextNode(chord));
    el.classList.add('chord');
    return el;
};

export const createNoteElement = (note, chord) => {
    const el = document.createElement('div');
    el.classList.add('note', note);
    if (chord) {
        el.appendChild(createChordElement(chord));
    }
    return el;
};

export const createMultiNoteElement = (notes = [], chord = '') => {
    if (!Array.isArray(notes)) {
        return createNoteElement(notes, chord);
    }
    const el = document.createElement('div');
    el.classList.add('note', `v-space-${notes.length - 1}`, notes[0]);
    for (let i=1 ; i<notes.length ; i++) {
        const childEl = document.createElement('div');
        childEl.classList.add('note', 'multinote', notes[i]);
        el.appendChild(childEl);
    }
    if (chord) {
        el.appendChild(createChordElement(chord));
    }
    return el;
};

export const createLyricElement = (text = null) => {
    const el = document.createElement('div');
    el.classList.add('lyric');
    el.innerHTML = text || '&nbsp;';
    return el;
};
