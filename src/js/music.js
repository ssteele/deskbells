const notesInOctaveCount = 12;

export const getInstrument = (instruments = [], instrumentId) => {
    return instruments.find((i) => {
        return i.id === instrumentId;
    });
};

export const getSong = (songs = [], songId) => {
    return songs.find((s) => {
        return s.id === songId;
    });
};

export const getUniqueNotes = (song) => {
    const { lines } = song;
    let allNotes = [];
    lines.map((line) => {
        const { notes } = line;
        // @todo: Array.flat() crashes ipad
        // const foo = notes.flat(1);
        // allNotes = [ ...notes.flat(), ...allNotes ];
        allNotes = [ ...Array.prototype.concat.apply([], notes), ...allNotes ];
        // const allNestedNotes = notes.map((n) => {
        //     let output = n;
        //     if (Array.isArray(n)) {
        //         // @todo: handle array
        //         output = n[0];
        //     }
        //     return output;
        // })
        // allNotes = [ ...allNestedNotes, ...allNotes ];
    });
    return [...new Set(allNotes)].sort((a, b) => a - b);
};

export const mapInstrumentNotes = (instrument) => {
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

export const shift = (song, shiftValue) => {
    return {
        ...song, 
        lines: [
            ...song.lines.map((line) => {
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
                };
            }),
        ],
    };
};
