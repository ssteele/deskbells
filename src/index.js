import {
    createLineElement,
    createNoteElement,
    createLyricElement,
} from './elements.js';
import { instruments } from './instruments.js';
import {
    getAlignedTranspositions,
    getInstrument,
    getSong,
    getUniqueNotes,
    mapInstrumentNotes,
    shift,
} from './music.js';
import { songs } from './songs.js';
import {
    setDoRenderLyrics,
    setInstrumentId,
    setSongId,
    setTransposition,
    setTranspositions,
    setUniqueNotes,
    state,
} from './state.js';

// dom elements registry
const lyricToggleEl = document.getElementById('lyric-toggle');
const instrumentSelectEl = document.getElementById('instrument-select');
const transpositionSelectEl = document.getElementById('transposition-select');
const songSelectEl = document.getElementById('song-select');
const songEl = document.getElementById('song');

const resetSongEl = (instrumentId) => {
    songEl.innerHTML = '';
    songEl.classList = instrumentId;
};

const getCurrentEl = (lineEl) => {
    const divs = lineEl.getElementsByTagName('div');
    const currentEl = divs[divs.length - 1];
    return currentEl;
};

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

const transpose = (song, instrument) => {
    const uniqueNotes = setUniqueNotes(getUniqueNotes(song));
    const instrumentNotes = mapInstrumentNotes(instrument);
    const alignments = setTranspositions(getAlignedTranspositions(uniqueNotes, instrumentNotes));
    if (alignments.length) {
        return shift(song, alignments[0]);
    }
    return false;
};

const loadTransposed = (songs, instruments, state) => {
    const instrument = getInstrument(instruments, state.instrumentId);
    const song = shift(getSong(songs, state.songId), state.transposition);
    renderSong(song, instrument, state);
};

const loadSong = (songs, instruments, state) => {
    const instrument = getInstrument(instruments, state.instrumentId);
    const song = transpose(getSong(songs, state.songId), instrument);
    if (!song) {
        const lineEl = renderLine(songEl);
        renderLyric(lineEl, 'No valid transpositions for selected instrument');
        return;
    }
    renderTranspositionSelect(state.transpositions);
    renderSong(song, instrument, state);
};

// lyrics toggle
const renderLyricToggle = () => {
    lyricToggleEl.innerHTML = `
        <div>
            <input type="checkbox" id="lyrics" name="lyrics" checked>
            <label for="lyrics">Lyrics</label>
        </div>
    `;
};

// instrument select
const renderInstrumentSelect = (instruments) => {
    const instrumentOptions = instruments.map((i) => {
        return `<option value="${i.id}">${i.name}</option>`;
    });
    instrumentSelectEl.innerHTML = `
        <select name="instruments" id="instruments">
            ${instrumentOptions}
        </select>
    `;
};

// transposition select
const renderTranspositionSelect = (transpositions) => {
    const transpositionOptions = transpositions.map((t) => {
        return `<option value="${t}">Transpose +${t}</option>`;
    });
    transpositionSelectEl.innerHTML = `
        <select name="transpositions" id="transpositions">
            ${transpositionOptions}
        </select>
    `;
};

// song select
const renderSongOptions = (songs) => {
    const songOptions = songs.map((s) => {
        return `<option value="${s.id}">${s.name}</option>`;
    });
    songSelectEl.innerHTML = `
        <select name="songs" id="songs">
            ${songOptions}
        </select>
    `;
};

// handle lyric toggle
lyricToggleEl.addEventListener('change', (e) => {
    setDoRenderLyrics(e.target.checked);
    loadSong(songs, instruments, state);
});

// handle instrument select
instrumentSelectEl.addEventListener('change', (e) => {
    setInstrumentId(e.target.value);
    loadSong(songs, instruments, state);
});

// handle transposition select
transpositionSelectEl.addEventListener('change', (e) => {
    setTransposition(e.target.value);
    loadTransposed(songs, instruments, state);
});

// handle song select
songSelectEl.addEventListener('change', (e) => {
    setSongId(e.target.value);
    loadSong(songs, instruments, state);
});

// initialize
renderLyricToggle();
renderInstrumentSelect(instruments);
renderSongOptions(songs)
loadSong(songs, instruments, state);
