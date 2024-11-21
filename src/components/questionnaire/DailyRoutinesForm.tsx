import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { FormField } from '@/components/common/FormField';
import { TextArea } from '@/components/common/TextArea';
import { useQuestionnaireStore } from '@/stores/questionnaire';
import type { DailyRoutine } from '@/types/questionnaire';

const dailyRoutineSchema = z.object({
  timeOfDay: z.string().min(1, 'Time of day is required'),
  activity: z.string().min(1, 'Activity is required'),
  duration: z.string().min(1, 'Duration is required'),
  potentialImprovements: z.string().min(1, 'Potential improvements are required'),
});

const dailyRoutinesSchema = z.object({
  dailyRoutines: z.array(dailyRoutineSchema).min(1, 'At least one daily routine is required'),
});

type DailyRoutinesFormData = {
  dailyRoutines: DailyRoutine[];
};

export function DailyRoutinesForm() {
  const { addDailyRoutine, removeDailyRoutine } = useQuestionnaireStore();
  const dailyRoutines = useQuestionnaireStore((state) => state.data.dailyRoutines) || [];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DailyRoutinesFormData>({
    resolver: zodResolver(dailyRoutinesSchema),
    defaultValues: {
      dailyRoutines,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dailyRoutines',
  });

  const onSubmit = (data: DailyRoutinesFormData) => {
    // Clear existing daily routines
    dailyRoutines.forEach((_, index) => removeDailyRoutine(index));
    // Add new daily routines
    data.dailyRoutines.forEach((routine) => addDailyRoutine(routine));
    useQuestionnaireStore.getState().setCurrentStep(4);
  };

  const timeOfDayOptions = [
    'Early Morning (5am-8am)',
    'Morning (8am-11am)',
    'Midday (11am-2pm)',
    'Afternoon (2pm-5pm)',
    'Evening (5pm-8pm)',
    'Night (8pm-11pm)',
    'Late Night (11pm-5am)',
  ];

  const durationOptions = [
    '15 minutes',
    '30 minutes',
    '45 minutes',
    '1 hour',
    '1.5 hours',
    '2 hours',
    '2+ hours',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-lg border border-gray-200 p-4 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium">Daily Routine {index + 1}</h4>
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
              label="Time of Day"
              error={errors.dailyRoutines?.[index]?.timeOfDay?.message}
              required
            >
              <select
                {...register(`dailyRoutines.${index}.timeOfDay`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select a time of day</option>
                {timeOfDayOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Activity"
              error={errors.dailyRoutines?.[index]?.activity?.message}
              required
            >
              <TextArea
                {...register(`dailyRoutines.${index}.activity`)}
                placeholder="What do you typically do during this time?"
                rows={2}
              />
            </FormField>

            <FormField
              label="Duration"
              error={errors.dailyRoutines?.[index]?.duration?.message}
              required
            >
              <select
                {...register(`dailyRoutines.${index}.duration`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select duration</option>
                {durationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Potential Improvements"
              error={errors.dailyRoutines?.[index]?.potentialImprovements?.message}
              required
            >
              <TextArea
                {...register(`dailyRoutines.${index}.potentialImprovements`)}
                placeholder="How could this time be used more effectively?"
                rows={2}
              />
            </FormField>
          </div>
        ))}
      </div>

      {fields.length < 5 && (
        <button
          type="button"
          onClick={() =>
            append({
              timeOfDay: '',
              activity: '',
              duration: '',
              potentialImprovements: '',
            })
          }
          className="flex items-center text-primary-600 hover:text-primary-700"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add another routine
        </button>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => useQuestionnaireStore.getState().setCurrentStep(2)}
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
