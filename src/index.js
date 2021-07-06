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

const renderNote = (lineEl, bells, index = 1) => {
    const bell = bells.find((b) => {
        return b.index === index;
    })
    lineEl.append(createNoteElement(bell));

    const divs = lineEl.getElementsByTagName('div');
    const currentNote = divs[divs.length - 1];
    return currentNote;
};

const renderLyric = (lineEl, lyric = ' ') => {
    lineEl.append(createLyricElement(lyric));

    const divs = lineEl.getElementsByTagName('div');
    const currentLyric = divs[divs.length - 1];
    return currentLyric;
};

const renderLine = (songEl) => {
    songEl.append(createLineElement());

    const divs = songEl.getElementsByTagName('div');
    const currentLine = divs[divs.length - 1];
    return currentLine;
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
