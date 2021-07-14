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
        allNotes = [ ...line.notes, ...allNotes ];
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
            const shift = e + i;
            return (shift < (notesInOctaveCount + 1)) ? shift : shift - notesInOctaveCount;
        }).every(e => instrumentNotes.includes(e))) {
            alignments.push(i);
        }
    }
    return alignments;
};

export const shift = (song, shiftValue) => {
    return { 
        ...song, 
        lines: [
            ...song.lines.map((line) => {
                return {
                    ...line,
                    notes: line.notes.map((e) => {
                        const shifted = e + shiftValue;
                        return (shifted < (notesInOctaveCount + 1)) ? shifted : shifted - notesInOctaveCount;
                    }),
                };
            }),
        ],
    };
};
