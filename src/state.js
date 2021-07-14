// mutable state
export const state = {
    doRenderLyrics: true,
    instrumentId: 'deskbells',
    songId: 'twinkle-twinkle',
    transpositions: [],
    uniqueNotes: [],
};

export const setDoRenderLyrics = (doRenderLyrics) => {
    state.doRenderLyrics = doRenderLyrics;
    return doRenderLyrics;
};

export const setInstrumentId = (instrumentId) => {
    state.instrumentId = instrumentId;
    return instrumentId;
};

export const setSongId = (songId) => {
    state.songId = songId;
    return songId;
};

export const setTranspositions = (transpositions) => {
    state.transpositions = transpositions;
    return transpositions;
};

export const setUniqueNotes = (uniqueNotes) => {
    state.uniqueNotes = uniqueNotes;
    return uniqueNotes;
};
