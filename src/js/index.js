import {
    chords,
    instruments,
    songs,
} from './constants/index.js';
import {
    createLineElement,
    createLyricElement,
    createMultiNoteElement,
    createNoteElement,
} from './elements.js';
import {
    Instrument,
    Line,
    Song,
} from './models/index.js';
import {
    getAlignedTranspositions,
    getInstrument,
    getSong,
    getUniqueNotes,
    mapInstrumentNotes,
    shift,
} from './music.js';
import {
    setDoRenderChords,
    setDoRenderLyrics,
    setInstrumentId,
    setSongId,
    setTransposition,
    setTranspositions,
    setUniqueNotes,
    setVersion,
    setVersions,
    state,
} from './state.js';

// dom elements registry
const notesListEl = document.getElementById('notes-list');
const instrumentSelectEl = document.getElementById('instrument-select');
const versionSelectEl = document.getElementById('version-select');
const transpositionSelectEl = document.getElementById('transposition-select');
const chordToggleEl = document.getElementById('chord-toggle');
const lyricToggleEl = document.getElementById('lyric-toggle');
const songSelectEl = document.getElementById('song-select');
const songEl = document.getElementById('song');

const zip = (a, b) => {
    return a.map((x, i) => [x, b[i]]);
};

const resetSongEl = (instrumentId) => {
    songEl.innerHTML = '';
    songEl.classList = instrumentId;
};

const getCurrentEl = (lineEl) => {
    const divs = lineEl.getElementsByTagName('div');
    const currentEl = divs[divs.length - 1];
    return currentEl;
};

const transformChord = (chordsMap = [], chord = []) => {
    let mtdChord = (Array.isArray(chord)) ? chord : [ chord ];
    const [chordIndex, ...symbols] = mtdChord;
    if (chordIndex) {
        const { note: root } = chordsMap.find((n) => {
            return n.index === chordIndex;
        });
        if (root) {
            return [root.toUpperCase(), ...symbols].join('');
        }
    }
    return '';
};

const renderNote = (lineEl, notesMap = [], noteIndex = 1, chordsMap = [], chord = []) => {
    const { note } = notesMap.find((n) => {
        return n.index === noteIndex;
    });
    const transformedChord = transformChord(chordsMap, chord);
    lineEl.append(createNoteElement(note, transformedChord));
    return getCurrentEl(lineEl);
};

const renderNotes = (lineEl, notesMap = [], notes = [], chordsMap = [], chord = []) => {
    const transformedNotes = notes
        .sort((a, b) => a - b)
        .map((noteIndex) => {
            return (notesMap.find((n) => {
                return n.index === noteIndex;
            }) || {}).note;
        });
    const transformedChord = transformChord(chordsMap, chord);
    lineEl.append(createMultiNoteElement(transformedNotes, transformedChord));
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

const renderSong = (
    lines = [ new Line() ],
    instrument = new Instrument(),
    chordsMap = [],
    {
        doRenderChords = true,
        doRenderLyrics = true,
    }
) => {
    const { id: instrumentId, notesMap } = instrument;
    resetSongEl(instrumentId);
    for (const { notes, chords, lyrics } of lines) {
        let mtdChords = chords;
        if (!doRenderChords) {
            mtdChords = [];
        }
        let lineEl;
        lineEl = renderLine(songEl);
        for (let [note, chord] of zip(notes, mtdChords)) {
            if (Array.isArray(note)) {
                renderNotes(lineEl, notesMap, note, chordsMap, chord);
            } else {
                renderNote(lineEl, notesMap, note, chordsMap, chord);
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

const transpose = (lines = [ new Line() ], instrument = new Instrument()) => {
    const uniqueNotes = getUniqueNotes(lines);
    const instrumentNotes = mapInstrumentNotes(instrument);
    const alignments = setTranspositions(getAlignedTranspositions(uniqueNotes, instrumentNotes));
    if (alignments.length) {
        return alignments[0];
    }
    return false;
};

const loadSong = (songs, instruments, state) => {
    const instrument = getInstrument(instruments, state.instrumentId);
    const song = new Song(getSong(songs, state.songId));
    const { versions } = song;
    const activeVersions = versions.filter((v) => v.isActive);
    setVersions(activeVersions)
    const { version } = state;
    const { lines } = activeVersions.find((s) => s.id === version) || activeVersions[0];
    const alignment = state.transposition ?? transpose(lines, instrument);
    if (false === alignment) {
        return {};
    }
    setTransposition(alignment);
    const shiftedLines = shift(lines, alignment);
    // console.log('shiftedLines:', shiftedLines);
    return {
        lines: shiftedLines,
        instrument,
    };
};

const update = (songs, instruments, chords, state) => {
    const { lines = [ new Line() ], instrument = new Instrument() } = loadSong(songs, instruments, state);
    const { chordsMap } = chords;
    const uniqueNotes = setUniqueNotes(getUniqueNotes(lines));
    renderNotesList(instrument, uniqueNotes);
    renderSong(lines, instrument, chordsMap, state);
}

// notes list
const renderNotesList = (instrument = new Instrument(), uniqueNotes = []) => {
    const { notesMap } = instrument;
    const notesList = uniqueNotes.map((n) => {
        const { note = false } = notesMap.find((nm) => {
            return nm.index === n;
        }) || {};
        if (note) {
            return `<div class="unique-note ${note}"></div>`;
        }
    });
    notesListEl.innerHTML = `
        <div class="line ${instrument.id}">
            ${notesList.join(' ')}
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

// instrument select
const renderVersionSelect = (versions) => {
    const versionOptions = versions.filter((v) => {
        return v.isActive;
    }).map((v) => {
        const name = v.name || 'Level';
        let label = `${name} ${'&#9733;'.repeat(v.level)}`;
        return `<option value="${v.id}">${label}</option>`;
    });
    versionSelectEl.innerHTML = `
        <select name="versions" id="versions">
            ${versionOptions}
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

// chords toggle
const renderChordToggle = () => {
    chordToggleEl.innerHTML = `
        <div>
            <input type="checkbox" id="chords" name="chords" checked>
            <label for="chords">Chords</label>
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

// song select
const renderSongOptions = (songs) => {
    const songOptions = songs.filter((s) => {
        if (s.isActive) {
            const { versions } = s;
            return versions.some((v) => v.isActive);
        }
    }).map((s) => {
        return `<option value="${s.id}">${s.name}</option>`;
    });
    songSelectEl.innerHTML = `
        <select name="songs" id="songs">
            ${songOptions}
        </select>
    `;
};

// handle instrument select
instrumentSelectEl.addEventListener('change', (e) => {
    setInstrumentId(e.target.value);
    update(songs, instruments, chords, state);
});

// handle version select
versionSelectEl.addEventListener('change', (e) => {
    setVersion(e.target.value);
    update(songs, instruments, chords, state);
});

// handle transposition select
transpositionSelectEl.addEventListener('change', (e) => {
    setTransposition(e.target.value);
    update(songs, instruments, chords, state);
});

// handle chord toggle
chordToggleEl.addEventListener('change', (e) => {
    setDoRenderChords(e.target.checked);
    update(songs, instruments, chords, state);
});

// handle lyric toggle
lyricToggleEl.addEventListener('change', (e) => {
    setDoRenderLyrics(e.target.checked);
    update(songs, instruments, chords, state);
});

// handle song select
songSelectEl.addEventListener('change', (e) => {
    setSongId(e.target.value);
    setVersion(null);
    setTransposition(null);
    update(songs, instruments, chords, state);
    renderVersionSelect(state.versions);
    renderTranspositionSelect(state.transpositions);
});

// initialize
renderChordToggle();
renderLyricToggle();
renderInstrumentSelect(instruments);
renderSongOptions(songs)
update(songs, instruments, chords, state);
renderVersionSelect(state.versions);
renderTranspositionSelect(state.transpositions);
