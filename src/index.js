import { bells } from './bells.js';
import { songs } from './songs.js';
import {
    createLineElement,
    createNoteElement,
    createLyricElement,
} from './elements.js';

const doRenderLyrics = true;

let instrument = 'deskbells';
// instrument = 'xylophone';

let songId = 'twinkle-twinkle';
// songId = 'lightly-row';
// songId = 'aserrin-aserran';
// songId = 'yesterday';

// dom elements
const titleEl = document.getElementById('title');
const songEl = document.getElementById('song');

const song = songs.find((s) => {
    return s.id === songId;
});

titleEl.innerHTML = song.name;
songEl.classList.add(instrument);

const getCurrentEl = (lineEl, bells, index = 1) => {
    const divs = lineEl.getElementsByTagName('div');
    const currentEl = divs[divs.length - 1];
    return currentEl;
}

const renderNote = (lineEl, bells, index = 1) => {
    const bell = bells.find((b) => {
        return b.index === index;
    })
    lineEl.append(createNoteElement(bell));
    return getCurrentEl(lineEl);
};

const renderLyric = (lineEl, lyric = ' ') => {
    lineEl.append(createLyricElement(lyric));
    return getCurrentEl(lineEl);
};

const renderLine = (songEl) => {
    songEl.append(createLineElement());
    return getCurrentEl(songEl);
};

const renderSong = (song) => {
    const { lines } = song;
    for (const { notes, lyrics } of lines) {
        let lineEl;
        lineEl = renderLine(songEl);
        for (const note of notes) {
            renderNote(lineEl, bells, note);
        }

        if (doRenderLyrics) {
            lineEl = renderLine(songEl);
            for (const lyric of lyrics) {
                renderLyric(lineEl, lyric);
            }
        }
    }
};

renderSong(song);
