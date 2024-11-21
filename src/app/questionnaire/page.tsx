'use client';

import { QuestionnaireLayout } from '@/components/questionnaire/QuestionnaireLayout';
import { PersonalInfoForm } from '@/components/questionnaire/PersonalInfoForm';
import { StrengthsForm } from '@/components/questionnaire/StrengthsForm';
import { GrowthTopicsForm } from '@/components/questionnaire/GrowthTopicsForm';
import { DailyRoutinesForm } from '@/components/questionnaire/DailyRoutinesForm';
import { LearningPreferencesForm } from '@/components/questionnaire/LearningPreferencesForm';
import { QuestionnaireSummary } from '@/components/questionnaire/QuestionnaireSummary';
import { useQuestionnaireStore } from '@/stores/questionnaire';

export default function QuestionnairePage() {
  const currentStep = useQuestionnaireStore((state) => state.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoForm />;
      case 1:
        return <StrengthsForm />;
      case 2:
        return <GrowthTopicsForm />;
      case 3:
        return <DailyRoutinesForm />;
      case 4:
        return <LearningPreferencesForm />;
      case 5:
        return <QuestionnaireSummary />;
      default:
        return <div>Something went wrong</div>;
    }
  };

  return <QuestionnaireLayout>{renderStep()}</QuestionnaireLayout>;
}
