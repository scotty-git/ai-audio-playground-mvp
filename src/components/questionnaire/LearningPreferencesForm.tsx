import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField } from '@/components/common/FormField';
import { TextArea } from '@/components/common/TextArea';
import { useQuestionnaireStore } from '@/stores/questionnaire';
import type { LearningPreferences } from '@/types/questionnaire';

const learningPreferencesSchema = z.object({
  preferredLearningStyle: z.string().min(1, 'Preferred learning style is required'),
  preferredContentLength: z.string().min(1, 'Preferred content length is required'),
  preferredVoiceStyle: z.string().min(1, 'Preferred voice style is required'),
  additionalNotes: z.string().optional(),
});

type LearningPreferencesFormData = LearningPreferences;

export function LearningPreferencesForm() {
  const { setLearningPreferences } = useQuestionnaireStore();
  const learningPreferences = useQuestionnaireStore((state) => state.data.learningPreferences);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LearningPreferencesFormData>({
    resolver: zodResolver(learningPreferencesSchema),
    defaultValues: learningPreferences || {
      preferredLearningStyle: '',
      preferredContentLength: '',
      preferredVoiceStyle: '',
      additionalNotes: '',
    },
  });

  const onSubmit = (data: LearningPreferencesFormData) => {
    setLearningPreferences(data);
    // Navigate to the summary or results page
    useQuestionnaireStore.getState().setCurrentStep(5);
  };

  const learningStyleOptions = [
    'Visual - I learn best through images and diagrams',
    'Auditory - I learn best through listening and discussion',
    'Reading/Writing - I learn best through written content',
    'Kinesthetic - I learn best through hands-on experience',
    'Mixed - I prefer a combination of learning styles',
  ];

  const contentLengthOptions = [
    'Brief (1-3 minutes)',
    'Short (3-5 minutes)',
    'Medium (5-10 minutes)',
    'Long (10-15 minutes)',
    'Extended (15+ minutes)',
  ];

  const voiceStyleOptions = [
    'Professional and formal',
    'Casual and conversational',
    'Energetic and motivational',
    'Calm and soothing',
    'Direct and concise',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        label="Preferred Learning Style"
        error={errors.preferredLearningStyle?.message}
        required
      >
        <select
          {...register('preferredLearningStyle')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">Select your preferred learning style</option>
          {learningStyleOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Preferred Content Length"
        error={errors.preferredContentLength?.message}
        required
      >
        <select
          {...register('preferredContentLength')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">Select your preferred content length</option>
          {contentLengthOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Preferred Voice Style"
        error={errors.preferredVoiceStyle?.message}
        required
      >
        <select
          {...register('preferredVoiceStyle')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">Select your preferred voice style</option>
          {voiceStyleOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Additional Notes"
        error={errors.additionalNotes?.message}
        helperText="Any other preferences or requirements you'd like us to know about"
      >
        <TextArea
          {...register('additionalNotes')}
          placeholder="Share any additional preferences or requirements..."
          rows={3}
        />
      </FormField>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => useQuestionnaireStore.getState().setCurrentStep(3)}
          className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200"
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Complete
        </button>
      </div>
    </form>
  );
}
