// mutable state
export const state = {
    doRenderLyrics: true,
    instrumentId: 'deskbells',
    songId: 'twinkle-twinkle',
    transposition: 0,
    transpositions: [0, 5],
    uniqueNotes: [],
};

export const setDoRenderLyrics = (doRenderLyrics = true) => {
    state.doRenderLyrics = !!doRenderLyrics;
    return state.doRenderLyrics;
};

export const setInstrumentId = (instrumentId = '') => {
    state.instrumentId = `${instrumentId}`;
    return state.instrumentId;
};

export const setSongId = (songId = '') => {
    state.songId = `${songId}`;
    return state.songId;
};

export const setTransposition = (transposition = 0) => {
    state.transposition = +transposition;
    return state.transposition;
};

export const setTranspositions = (transpositions = []) => {
    state.transpositions = transpositions;
    return state.transpositions;
};

export const setUniqueNotes = (uniqueNotes = []) => {
    const filteredUniqueNotes = uniqueNotes.filter((n) => n !== 0);
    state.uniqueNotes = filteredUniqueNotes;
    return state.uniqueNotes;
};
