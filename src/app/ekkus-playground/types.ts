export interface FormData {
    age: number;
    genre: string;
    interests: string[];
    likedAuthors: string[];
    tone: string;
    readingPurpose: string;
    locale: string;
    customParams: Record<string, string>;
}

export interface CustomParam {
    name: string;
    value: string;
}
