let seqToken: string;

export const setSeqToken = (hashCode: string) => {
    seqToken = hashCode;
};

export const getSeqToken = (): string => {
    return seqToken;
};
