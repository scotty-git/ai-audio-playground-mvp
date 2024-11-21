import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { FormField } from '@/components/common/FormField';
import { TextArea } from '@/components/common/TextArea';
import { useQuestionnaireStore } from '@/stores/questionnaire';
import type { Strength } from '@/types/questionnaire';

const strengthSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  example: z.string().min(1, 'Example is required'),
});

const strengthsSchema = z.object({
  strengths: z.array(strengthSchema).min(1, 'At least one strength is required'),
});

type StrengthsFormData = {
  strengths: Strength[];
};

export function StrengthsForm() {
  const { addStrength, removeStrength } = useQuestionnaireStore();
  const strengths = useQuestionnaireStore((state) => state.data.strengths) || [];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StrengthsFormData>({
    resolver: zodResolver(strengthsSchema),
    defaultValues: {
      strengths,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'strengths',
  });

  const onSubmit = (data: StrengthsFormData) => {
    // Clear existing strengths
    strengths.forEach((_, index) => removeStrength(index));
    // Add new strengths
    data.strengths.forEach((strength) => addStrength(strength));
    useQuestionnaireStore.getState().setCurrentStep(2);
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
              <h4 className="text-lg font-medium">Strength {index + 1}</h4>
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
              label="Description"
              error={errors.strengths?.[index]?.description?.message}
              required
            >
              <TextArea
                {...register(`strengths.${index}.description`)}
                placeholder="Describe one of your top strengths..."
                rows={3}
              />
            </FormField>

            <FormField
              label="Example"
              error={errors.strengths?.[index]?.example?.message}
              required
            >
              <TextArea
                {...register(`strengths.${index}.example`)}
                placeholder="Provide an example of this strength in action..."
                rows={3}
              />
            </FormField>
          </div>
        ))}
      </div>

      {fields.length < 3 && (
        <button
          type="button"
          onClick={() => append({ description: '', example: '' })}
          className="flex items-center text-primary-600 hover:text-primary-700"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add another strength
        </button>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => useQuestionnaireStore.getState().setCurrentStep(0)}
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
