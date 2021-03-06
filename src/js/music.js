import {
    Instrument,
    Song,
} from './models/index.js';
const notesInOctaveCount = 12;

export const getInstrument = (instruments = [], instrumentId) => {
    return instruments.find((i) => {
        return i.id === instrumentId;
    }) || new Instrument();
};

export const getSong = (songs = [], songId) => {
    return songs.find((s) => {
        // get the selected song so long as it's active
        if (s.id === songId) {
            const { versions } = s;
            return s.isActive && versions.some((v) => v.isActive);
        }
    }) || songs.find((s) => {
        // otherwise get the first active song
        const { versions } = s;
        return s.isActive && versions.some((v) => v.isActive);
    }) || new Song();
};

export const getUniqueNotes = (lines = [ new Line() ]) => {
    let allNotes = [];
    lines.map((line) => {
        const { notes } = line;
        // would use es6 version, but i need this to work on an old ipad
        // allNotes = [ ...notes.flat(), ...allNotes ];
        allNotes = [ ...Array.prototype.concat.apply([], notes), ...allNotes ];
    });
    return [...new Set(allNotes)].sort((a, b) => a - b);
};

export const mapInstrumentNotes = (instrument = new Instrument()) => {
    const { notesMap } = instrument;
    return notesMap.map((nm) => {
        return nm.index;
    });
};

export const getAlignedTranspositions = (uniqueNotes, instrumentNotes) => {
    let alignments = [];
    for (let i=0 ; i<notesInOctaveCount ; i++) { 
        if (uniqueNotes.map((e) => {
            const shifted = e + i;
            return (shifted < (notesInOctaveCount + 1)) ? shifted : shifted - notesInOctaveCount;
        }).every(e => instrumentNotes.includes(e))) {
            alignments.push(i);
        }
    }
    return alignments;
};

const calculateShift = (note, shiftValue) => {
    if (0 === note) {
        return 0;
    }
    const shifted = note + shiftValue;
    return (shifted < (notesInOctaveCount + 1)) ? shifted : shifted - notesInOctaveCount;
}

export const shift = (lines = [ new Line() ], shiftValue = 0) => {
    return lines.map((line) => {
        return {
            ...line,
            notes: line.notes.map((note) => {
                if (Array.isArray(note)) {
                    return note.map((n) => {
                        return calculateShift(n, shiftValue);
                    });
                }
                return calculateShift(note, shiftValue);
            }),
            chords: line.chords.map((chord) => {
                if (Array.isArray(chord)) {
                    const [root, ...symbols] = chord;
                    return [calculateShift(root, shiftValue), ...symbols];
                }
                return calculateShift(chord, shiftValue);
            }),
        };
    });
};
