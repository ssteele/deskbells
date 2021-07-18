import {
    instruments,
    songs,
} from './constants/index.js';
import {
    createChordElement,
    createLineElement,
    createLyricElement,
    createNoteElement,
} from './elements.js';
import {
    getAlignedTranspositions,
    getInstrument,
    getSong,
    getUniqueNotes,
    mapInstrumentNotes,
    shift,
} from './music.js';
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
const notesListEl = document.getElementById('notes-list');
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

const renderChord = (lineEl, notesMap, chord = []) => {
    const notes = chord
        .sort((a, b) => a - b)
        .map((noteIndex) => {
            return notesMap.find((n) => {
                return n.index === noteIndex;
            }).note;
        });
    lineEl.append(createChordElement(notes));
    return getCurrentEl(lineEl);
};

const renderNote = (lineEl, notesMap, noteIndex = 1) => {
    const { note } = notesMap.find((n) => {
        return n.index === noteIndex;
    });
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
            if (Array.isArray(note)) {
                renderChord(lineEl, notesMap, note);
            } else {
                renderNote(lineEl, notesMap, note);
            }
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
    const uniqueNotes = getUniqueNotes(song);
    const instrumentNotes = mapInstrumentNotes(instrument);
    const alignments = setTranspositions(getAlignedTranspositions(uniqueNotes, instrumentNotes));
    if (alignments.length) {
        return alignments[0];
    }
    return false;
};

const loadSong = (songs, instruments, state) => {
    const instrument = getInstrument(instruments, state.instrumentId);
    const song = getSong(songs, state.songId);
    const alignment = state.transposition ?? setTransposition(transpose(song, instrument));
    if (false === alignment) {
        const lineEl = renderLine(songEl);
        renderLyric(lineEl, 'No valid transpositions for selected instrument');
        return false;
    }
    return {
        song: shift(song, alignment),
        instrument,
    };
};

const update = (songs, instruments, state) => {
    const {song, instrument } = loadSong(songs, instruments, state);
    const uniqueNotes = setUniqueNotes(getUniqueNotes(song));
    renderNotesList(instrument, uniqueNotes);
    renderSong(song, instrument, state);
}

// notes list
const renderNotesList = (instrument, uniqueNotes) => {
    const { notesMap } = instrument;
    const notesList = uniqueNotes.map((n) => {
        const { note } = notesMap.find((nm) => {
            return nm.index === n;
        });
        return `<div class="unique-note ${note}"></div>`;
    });
    notesListEl.innerHTML = `
        <div class="line ${instrument.id}">
            ${notesList.join(' ')}
        </div>
    `;
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
    update(songs, instruments, state);
});

// handle instrument select
instrumentSelectEl.addEventListener('change', (e) => {
    setInstrumentId(e.target.value);
    update(songs, instruments, state);
});

// handle transposition select
transpositionSelectEl.addEventListener('change', (e) => {
    setTransposition(e.target.value);
    update(songs, instruments, state);
});

// handle song select
songSelectEl.addEventListener('change', (e) => {
    setSongId(e.target.value);
    setTransposition(null);
    update(songs, instruments, state);
    renderTranspositionSelect(state.transpositions);
});

// initialize
renderLyricToggle();
renderInstrumentSelect(instruments);
renderSongOptions(songs)
update(songs, instruments, state);
renderTranspositionSelect(state.transpositions);
