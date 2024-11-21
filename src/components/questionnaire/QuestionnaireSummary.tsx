import { useQuestionnaireStore } from '@/stores/questionnaire';
import { useRouter } from 'next/navigation';

export function QuestionnaireSummary() {
  const router = useRouter();
  const { data, setCurrentStep } = useQuestionnaireStore();
  const {
    personalInfo,
    strengths,
    growthTopics,
    dailyRoutines,
    learningPreferences,
  } = data;

  const handleEdit = (step: number) => {
    setCurrentStep(step);
  };

  const handleContinue = () => {
    // Navigate to the dashboard or content generation page
    router.push('/dashboard');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Profile Summary</h2>
        <p className="mt-2 text-sm text-gray-600">
          Review your information before we create your personalized content
        </p>
      </div>

      {/* Personal Information */}
      <section className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
          <button
            onClick={() => handleEdit(0)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{personalInfo?.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Age</dt>
            <dd className="mt-1 text-sm text-gray-900">{personalInfo?.age}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Background</dt>
            <dd className="mt-1 text-sm text-gray-900">{personalInfo?.background}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Goals</dt>
            <dd className="mt-1 text-sm text-gray-900">{personalInfo?.goals}</dd>
          </div>
        </dl>
      </section>

      {/* Strengths */}
      <section className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Strengths</h3>
          <button
            onClick={() => handleEdit(1)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <div className="space-y-4">
          {strengths?.map((strength, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <h4 className="text-sm font-medium text-gray-900">Strength {index + 1}</h4>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{strength.description}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Example</dt>
                  <dd className="mt-1 text-sm text-gray-900">{strength.example}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* Growth Topics */}
      <section className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Growth Topics</h3>
          <button
            onClick={() => handleEdit(2)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <div className="space-y-4">
          {growthTopics?.map((topic, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <h4 className="text-sm font-medium text-gray-900">Topic {index + 1}</h4>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Topic</dt>
                  <dd className="mt-1 text-sm text-gray-900">{topic.topic}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Reason</dt>
                  <dd className="mt-1 text-sm text-gray-900">{topic.reason}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Desired Outcome</dt>
                  <dd className="mt-1 text-sm text-gray-900">{topic.desiredOutcome}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Routines */}
      <section className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Daily Routines</h3>
          <button
            onClick={() => handleEdit(3)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <div className="space-y-4">
          {dailyRoutines?.map((routine, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <h4 className="text-sm font-medium text-gray-900">Routine {index + 1}</h4>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Time of Day</dt>
                  <dd className="mt-1 text-sm text-gray-900">{routine.timeOfDay}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Activity</dt>
                  <dd className="mt-1 text-sm text-gray-900">{routine.activity}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Duration</dt>
                  <dd className="mt-1 text-sm text-gray-900">{routine.duration}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Potential Improvements</dt>
                  <dd className="mt-1 text-sm text-gray-900">{routine.potentialImprovements}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Preferences */}
      <section className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Learning Preferences</h3>
          <button
            onClick={() => handleEdit(4)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Learning Style</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {learningPreferences?.preferredLearningStyle}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Content Length</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {learningPreferences?.preferredContentLength}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Voice Style</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {learningPreferences?.preferredVoiceStyle}
            </dd>
          </div>
          {learningPreferences?.additionalNotes && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Additional Notes</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {learningPreferences.additionalNotes}
              </dd>
            </div>
          )}
        </dl>
      </section>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => handleEdit(4)}
          className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}
