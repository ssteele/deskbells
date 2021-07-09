import { bells } from './bells.js';
import { instruments } from './instruments.js';
import { songs } from './songs.js';
import {
    createLineElement,
    createNoteElement,
    createLyricElement,
} from './elements.js';

// initial config
const state = {
    doRenderLyrics: true,
    instrumentId: 'deskbells',
    songId: 'twinkle-twinkle',
}

// dom elements registry
const instrumentSelectEl = document.getElementById('instrument-select');
const lyricSelectEl = document.getElementById('lyric-select');
const songSelectEl = document.getElementById('song-select');
const songEl = document.getElementById('song');

const resetSongEl = (instrumentId) => {
    songEl.innerHTML = '';
    songEl.classList = instrumentId;
}

const setSongId = (songId) => {
    state.songId = songId;
};

const setDoRenderLyrics = (doRenderLyrics) => {
    state.doRenderLyrics = doRenderLyrics;
};

const setInstrumentId = (instrumentId) => {
    state.instrumentId = instrumentId;
};

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

const renderSong = (song) => {
    resetSongEl(state.instrumentId);
    const { lines } = song;
    for (const { notes, lyrics } of lines) {
        let lineEl;
        lineEl = renderLine(songEl);
        for (const note of notes) {
            renderNote(lineEl, bells, note);
        }

        if (state.doRenderLyrics) {
            lineEl = renderLine(songEl);
            for (const lyric of lyrics) {
                renderLyric(lineEl, lyric);
            }
        }
    }
};

// song select
const songOptions = songs.map((s) => {
    return `<option value="${s.id}">${s.name}</option>`;
});
songSelectEl.innerHTML = `
    <select name="songs" id="songs">
        ${songOptions}
    </select>
`;

// instrument select
const instrumentOptions = instruments.map((i) => {
    return `<option value="${i.id}">${i.name}</option>`;
});
instrumentSelectEl.innerHTML = `
    <select name="instruments" id="instruments">
        ${instrumentOptions}
    </select>
`;

// lyrics toggle
lyricSelectEl.innerHTML = `
    <div>
        <input type="checkbox" id="lyrics" name="lyrics" checked>
        <label for="lyrics">Lyrics</label>
    </div>
`;

// handle select events
document.addEventListener('input', function (e) {
    switch (e.target.id) {
        case 'songs':
            setSongId(e.target.value);

        case 'lyrics':
            setDoRenderLyrics(e.target.checked);

        case 'instruments':
            setInstrumentId(e.target.value);
    }
    renderSong(getSong(songs, state.songId));
}, false);

// initialize
renderSong(getSong(songs, state.songId));
