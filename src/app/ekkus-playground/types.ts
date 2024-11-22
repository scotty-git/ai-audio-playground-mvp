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

export interface OutlineResult {
  outline: string;
  promptUsed: string;
  paramsUsed: FormData;
  timestamp: string;
  story?: Story;
}

export interface Story {
  chapters: Chapter[];
  status: 'generating' | 'completed' | 'error';
  currentChapter: number;
  totalChapters: number;
}

export interface Chapter {
  content: string;
  index: number;
  status: 'generating' | 'completed' | 'error';
}
