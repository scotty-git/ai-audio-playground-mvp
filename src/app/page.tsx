import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          AI Audio Playground
        </h1>
        <p className="text-center mb-4">
          Create personalized audiobooks and affirmations using AI
        </p>
        <div className="flex justify-center">
          <Link
            href="/questionnaire"
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
