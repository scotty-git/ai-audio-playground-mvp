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
  id: string; 
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
  audioStatus?: 'generating' | 'completed' | 'error';
  currentAudioChapter?: number;
}

export interface Chapter {
  content: string;
  index: number;
  status: 'generating' | 'completed' | 'error';
  audioUrl?: string;
  audioStatus?: 'generating' | 'completed' | 'error';
}
