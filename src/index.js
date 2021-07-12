import { instruments } from './instruments.js';
import { songs } from './songs.js';
import {
    createLineElement,
    createNoteElement,
    createLyricElement,
} from './elements.js';

// mutable state
const state = {
    doRenderLyrics: true,
    instrumentId: 'deskbells',
    songId: 'twinkle-twinkle',
}

// dom elements registry
const songSelectEl = document.getElementById('song-select');
const instrumentSelectEl = document.getElementById('instrument-select');
const lyricToggleEl = document.getElementById('lyric-toggle');
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

const getInstrument = (instruments = [], instrumentId) => {
    return instruments.find((i) => {
        return i.id === instrumentId;
    });
};

const getCurrentEl = (lineEl) => {
    const divs = lineEl.getElementsByTagName('div');
    const currentEl = divs[divs.length - 1];
    return currentEl;
}

const renderNote = (lineEl, notesMap, index = 1) => {
    const note = notesMap.find((n) => {
        return n.index === index;
    })
    lineEl.append(createNoteElement(note));
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

const renderSong = (song, instrument, { doRenderLyrics }) => {
    const { lines } = song;
    const { id: instrumentId, notesMap } = instrument;
    resetSongEl(instrumentId);
    for (const { notes, lyrics } of lines) {
        let lineEl;
        lineEl = renderLine(songEl);
        for (const note of notes) {
            renderNote(lineEl, notesMap, note);
        }

        if (doRenderLyrics) {
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
lyricToggleEl.innerHTML = `
    <div>
        <input type="checkbox" id="lyrics" name="lyrics" checked>
        <label for="lyrics">Lyrics</label>
    </div>
`;

const transposeSong = (song, instrument) => {
    const { lines } = song;
    let allNotes = [];
    lines.map((line) => {
        allNotes = [ ...line.notes, ...allNotes ];
    })
    const uniqueNotes = [...new Set(allNotes)].sort((a, b) => a - b);
    console.log('uniqueNotes:', uniqueNotes);

    console.log('instrument:', instrument);
    return song;
}

const loadSong = (songs, instruments, state) => {
    const instrument = getInstrument(instruments, state.instrumentId);
    const song = transposeSong(getSong(songs, state.songId), instrument);
    renderSong(song, instrument, state);
}

// handle song select
songSelectEl.addEventListener('change', (e) => {
    setSongId(e.target.value);
    loadSong(songs, instruments, state);
})


// handle instrument select
instrumentSelectEl.addEventListener('change', (e) => {
    setInstrumentId(e.target.value);
    loadSong(songs, instruments, state);
})

// handle lyric toggle
lyricToggleEl.addEventListener('change', (e) => {
    setDoRenderLyrics(e.target.checked);
    loadSong(songs, instruments, state);
})

// initialize
loadSong(songs, instruments, state);
