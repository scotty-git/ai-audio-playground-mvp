import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  QuestionnaireData,
  PersonalInfo,
  Strength,
  GrowthTopic,
  DailyRoutine,
  LearningPreferences,
} from '@/types/questionnaire';

interface QuestionnaireStore {
  currentStep: number;
  data: Partial<QuestionnaireData>;
  setCurrentStep: (step: number) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addStrength: (strength: Strength) => void;
  removeStrength: (index: number) => void;
  addGrowthTopic: (topic: GrowthTopic) => void;
  removeGrowthTopic: (index: number) => void;
  updateTopicWeighting: (topicTitle: string, weight: number) => void;
  updateTopicOrder: (order: string[]) => void;
  updateDailyRoutine: (routine: Partial<DailyRoutine>) => void;
  updateLearningPreferences: (prefs: Partial<LearningPreferences>) => void;
  updateAdditionalNotes: (notes: string) => void;
  resetQuestionnaire: () => void;
}

const initialState: Partial<QuestionnaireData> = {
  strengths: [],
  growthTopics: [],
  topicWeighting: {},
  topicOrder: [],
};

export const useQuestionnaireStore = create<QuestionnaireStore>()(
  persist(
    (set) => ({
      currentStep: 0,
      data: initialState,
      setCurrentStep: (step) => set({ currentStep: step }),
      updatePersonalInfo: (info) =>
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: { ...state.data.personalInfo, ...info },
          },
        })),
      addStrength: (strength) =>
        set((state) => ({
          data: {
            ...state.data,
            strengths: [...(state.data.strengths || []), strength],
          },
        })),
      removeStrength: (index) =>
        set((state) => ({
          data: {
            ...state.data,
            strengths: state.data.strengths?.filter((_, i) => i !== index),
          },
        })),
      addGrowthTopic: (topic) =>
        set((state) => ({
          data: {
            ...state.data,
            growthTopics: [...(state.data.growthTopics || []), topic],
          },
        })),
      removeGrowthTopic: (index) =>
        set((state) => ({
          data: {
            ...state.data,
            growthTopics: state.data.growthTopics?.filter((_, i) => i !== index),
          },
        })),
      updateTopicWeighting: (topicTitle, weight) =>
        set((state) => ({
          data: {
            ...state.data,
            topicWeighting: {
              ...(state.data.topicWeighting || {}),
              [topicTitle]: weight,
            },
          },
        })),
      updateTopicOrder: (order) =>
        set((state) => ({
          data: { ...state.data, topicOrder: order },
        })),
      updateDailyRoutine: (routine) =>
        set((state) => ({
          data: {
            ...state.data,
            dailyRoutine: { ...state.data.dailyRoutine, ...routine },
          },
        })),
      updateLearningPreferences: (prefs) =>
        set((state) => ({
          data: {
            ...state.data,
            learningPreferences: {
              ...state.data.learningPreferences,
              ...prefs,
            },
          },
        })),
      updateAdditionalNotes: (notes) =>
        set((state) => ({
          data: { ...state.data, additionalNotes: notes },
        })),
      resetQuestionnaire: () =>
        set({ currentStep: 0, data: initialState }),
    }),
    {
      name: 'questionnaire-storage',
    }
  )
);
