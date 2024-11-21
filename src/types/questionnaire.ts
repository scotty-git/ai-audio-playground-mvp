export interface PersonalInfo {
  name: string;
  age: number;
  sex: string;
  occupation: string;
  livingSituation: string;
}

export interface Strength {
  description: string;
  example: string;
}

export interface GrowthTopic {
  title: string;
  currentSituation: string;
  importance: string;
  goals: string;
  emotionalImpact: string;
  personalExample: string;
  successDescription: string;
  previousApproaches: string;
}

export interface DailyRoutine {
  current: string;
  ideal: string;
  habits: {
    toBuild: string[];
    toBreak: string[];
  };
}

export interface LearningPreferences {
  resonatedApproaches: string;
  voicePreference: {
    gender: string;
    accent: string;
    style: string;
  };
}

export interface QuestionnaireData {
  personalInfo: PersonalInfo;
  strengths: Strength[];
  growthTopics: GrowthTopic[];
  topicWeighting: Record<string, number>;
  topicOrder: string[];
  dailyRoutine: DailyRoutine;
  learningPreferences: LearningPreferences;
  additionalNotes: string;
}
