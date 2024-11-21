import { useQuestionnaireStore } from '@/stores/questionnaire';
import { CheckIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

const steps = [
  { name: 'Personal Info', description: 'Basic information' },
  { name: 'Strengths', description: 'Your key strengths' },
  { name: 'Growth Topics', description: 'Areas to improve' },
  { name: 'Daily Routines', description: 'Your schedule' },
  { name: 'Learning Style', description: 'How you learn best' },
  { name: 'Review', description: 'Summary' },
];

interface QuestionnaireLayoutProps {
  children: React.ReactNode;
}

export function QuestionnaireLayout({ children }: QuestionnaireLayoutProps) {
  const currentStep = useQuestionnaireStore((state) => state.currentStep);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <nav aria-label="Progress">
          <ol
            role="list"
            className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
          >
            {steps.map((step, stepIdx) => (
              <li key={step.name} className="relative md:flex md:flex-1">
                {currentStep > stepIdx ? (
                  <div className="group flex w-full items-center">
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600">
                        <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                      <span className="ml-4 text-sm font-medium text-gray-900">
                        {step.name}
                      </span>
                    </span>
                  </div>
                ) : currentStep === stepIdx ? (
                  <div
                    className="flex items-center px-6 py-4 text-sm font-medium"
                    aria-current="step"
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary-600">
                      <span className="text-primary-600">{stepIdx + 1}</span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-primary-600">
                      {step.name}
                    </span>
                  </div>
                ) : (
                  <div className="group flex items-center">
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                        <span className="text-gray-500">{stepIdx + 1}</span>
                      </span>
                      <span className="ml-4 text-sm font-medium text-gray-500">
                        {step.name}
                      </span>
                    </span>
                  </div>
                )}

                {stepIdx !== steps.length - 1 ? (
                  <>
                    <div
                      className="absolute right-0 top-0 hidden h-full w-5 md:block"
                      aria-hidden="true"
                    >
                      <svg
                        className="h-full w-full text-gray-300"
                        viewBox="0 0 22 80"
                        fill="none"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 -2L20 40L0 82"
                          vectorEffect="non-scaling-stroke"
                          stroke="currentcolor"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </>
                ) : null}
              </li>
            ))}
          </ol>
        </nav>

        {/* Form Content */}
        <div className="mt-8 bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}
