import { bells } from './bells.js';
import { songs } from './songs.js';
import {
    createLineElement,
    createNoteElement,
    createLyricElement,
} from './elements.js';

// initial config
const doRenderLyrics = true;
let instrument = 'deskbells';
// instrument = 'xylophone';
let songId = 'twinkle-twinkle';

const resetSongEl = (songEl) => {
    songEl.innerHTML = '';
    songEl.classList.add(instrument);
}

const getSong = (songs = [], songId) => {
    return songs.find((s) => {
        return s.id === songId;
    });
};

const getCurrentEl = (lineEl) => {
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

const renderSong = (songEl, song) => {
    resetSongEl(songEl);
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

// dom elements
const titleEl = document.getElementById('title');
const songEl = document.getElementById('song');

const songOptions = songs.map((s) => {
    return `<option value="${s.id}">${s.name}</option>`;
});

titleEl.innerHTML = `
    <select name="songs" id="songs">
        ${songOptions}
    </select>
`;

document.addEventListener('input', function (e) {
    if (e.target.id === 'songs') {
        renderSong(songEl, getSong(songs, e.target.value));
    }
}, false);

renderSong(songEl, getSong(songs, songId));
