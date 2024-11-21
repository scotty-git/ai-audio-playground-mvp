import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField } from '@/components/common/FormField';
import { useQuestionnaireStore } from '@/stores/questionnaire';
import type { PersonalInfo } from '@/types/questionnaire';

const personalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().min(13, 'Must be at least 13 years old'),
  sex: z.string().min(1, 'Sex is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  livingSituation: z.string().min(1, 'Living situation is required'),
});

export function PersonalInfoForm() {
  const updatePersonalInfo = useQuestionnaireStore(
    (state) => state.updatePersonalInfo
  );
  const personalInfo = useQuestionnaireStore(
    (state) => state.data.personalInfo
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo,
  });

  const onSubmit = (data: PersonalInfo) => {
    updatePersonalInfo(data);
    useQuestionnaireStore.getState().setCurrentStep(1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField label="Name" error={errors.name?.message} required>
        <input
          type="text"
          {...register('name')}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
        />
      </FormField>

      <FormField label="Age" error={errors.age?.message} required>
        <input
          type="number"
          {...register('age', { valueAsNumber: true })}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
        />
      </FormField>

      <FormField label="Sex" error={errors.sex?.message} required>
        <select
          {...register('sex')}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
        >
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </FormField>

      <FormField
        label="Occupation"
        error={errors.occupation?.message}
        required
      >
        <input
          type="text"
          {...register('occupation')}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
        />
      </FormField>

      <FormField
        label="Living Situation"
        error={errors.livingSituation?.message}
        required
      >
        <select
          {...register('livingSituation')}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
        >
          <option value="">Select...</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="living-with-partner">Living with partner</option>
          <option value="have-children">Have children</option>
          <option value="other">Other</option>
        </select>
      </FormField>

      <div className="flex justify-end">
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
