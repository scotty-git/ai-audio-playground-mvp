import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { FormField } from '@/components/common/FormField';
import { TextArea } from '@/components/common/TextArea';
import { useQuestionnaireStore } from '@/stores/questionnaire';
import type { GrowthTopic } from '@/types/questionnaire';

const growthTopicSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  reason: z.string().min(1, 'Reason is required'),
  desiredOutcome: z.string().min(1, 'Desired outcome is required'),
});

const growthTopicsSchema = z.object({
  growthTopics: z.array(growthTopicSchema).min(1, 'At least one growth topic is required'),
});

type GrowthTopicsFormData = {
  growthTopics: GrowthTopic[];
};

export function GrowthTopicsForm() {
  const { addGrowthTopic, removeGrowthTopic } = useQuestionnaireStore();
  const growthTopics = useQuestionnaireStore((state) => state.data.growthTopics) || [];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GrowthTopicsFormData>({
    resolver: zodResolver(growthTopicsSchema),
    defaultValues: {
      growthTopics,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'growthTopics',
  });

  const onSubmit = (data: GrowthTopicsFormData) => {
    // Clear existing growth topics
    growthTopics.forEach((_, index) => removeGrowthTopic(index));
    // Add new growth topics
    data.growthTopics.forEach((topic) => addGrowthTopic(topic));
    useQuestionnaireStore.getState().setCurrentStep(3);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-lg border border-gray-200 p-4 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium">Growth Area {index + 1}</h4>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            <FormField
              label="Topic"
              error={errors.growthTopics?.[index]?.topic?.message}
              required
            >
              <TextArea
                {...register(`growthTopics.${index}.topic`)}
                placeholder="What area would you like to grow in?"
                rows={2}
              />
            </FormField>

            <FormField
              label="Reason"
              error={errors.growthTopics?.[index]?.reason?.message}
              required
            >
              <TextArea
                {...register(`growthTopics.${index}.reason`)}
                placeholder="Why is this area important to you?"
                rows={2}
              />
            </FormField>

            <FormField
              label="Desired Outcome"
              error={errors.growthTopics?.[index]?.desiredOutcome?.message}
              required
            >
              <TextArea
                {...register(`growthTopics.${index}.desiredOutcome`)}
                placeholder="What specific outcomes would you like to achieve?"
                rows={2}
              />
            </FormField>
          </div>
        ))}
      </div>

      {fields.length < 3 && (
        <button
          type="button"
          onClick={() => append({ topic: '', reason: '', desiredOutcome: '' })}
          className="flex items-center text-primary-600 hover:text-primary-700"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add another growth area
        </button>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => useQuestionnaireStore.getState().setCurrentStep(1)}
          className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200"
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Next
        </button>
      </div>
    </form>
  );
}
