import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center mt-1">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-1" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
