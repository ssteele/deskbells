import { bells } from './bells.js';
import { songs } from './songs.js';
import {
    createLineElement,
    createNoteElement,
    createLyricElement,
} from './elements.js';

const doRenderLyrics = true;

const songId = 'twinkle-twinkle';
// const songId = 'lightly-row';
// const songId = 'aserrin-aserran';

const song = songs.find((s) => {
    return s.id === songId;
});

const songEl = document.getElementById('song');

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
