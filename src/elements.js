export const createLineElement = () => {
    const el = document.createElement('div');
    el.classList.add('line');
    return el;
};

export const createNoteElement = (instrument) => {
    const el = document.createElement('div');
    el.classList.add('note', instrument.note);
    return el;
};

export const createLyricElement = (text = null) => {
    const el = document.createElement('div');
    el.classList.add('lyric');
    el.innerHTML = text || '&nbsp;';
    return el;
};
