'use client'

import { useEffect, useState } from 'react';

interface OutlineResult {
  outline: string;
  promptUsed: string;
  paramsUsed: {
    age: number;
    genre: string;
    interests: string[];
    likedAuthors: string[];
    tone: string;
    readingPurpose: string;
    locale: string;
    customParams: Record<string, string>;
  };
  timestamp: string;
}

export default function OutlinesPage() {
  const [outlines, setOutlines] = useState<OutlineResult[]>([]);
  const [expandedOutlines, setExpandedOutlines] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchOutlines = async () => {
      try {
        const response = await fetch('/api/outlines');
        const data = await response.json();
        setOutlines(data);
      } catch (error) {
        console.error('Error fetching outlines:', error);
      }
    };

    fetchOutlines();
  }, []);

  const toggleOutline = (index: number) => {
    setExpandedOutlines(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!outlines.length) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Generated Outlines</h1>
      <div className="space-y-8">
        {outlines
          .slice()
          .reverse()
          .map((outline, index) => (
            <div key={index} className="bg-white rounded-lg shadow">
              <button
                onClick={() => toggleOutline(index)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
              >
                <h2 className="text-xl font-semibold">
                  Outline {index + 1}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {new Date(outline.timestamp).toLocaleString()}
                  </span>
                </h2>
                <span className="text-gray-500">
                  {expandedOutlines[index] ? '▼' : '▶'}
                </span>
              </button>
              {expandedOutlines[index] && (
                <div className="p-6 pt-0 space-y-4 border-t">
                  <div>
                    <h3 className="font-medium text-gray-700">Parameters Used:</h3>
                    <ul className="mt-2 space-y-1">
                      <li>Age: {outline.paramsUsed.age}</li>
                      <li>Genre: {outline.paramsUsed.genre}</li>
                      <li>Interests: {outline.paramsUsed.interests.join(', ')}</li>
                      <li>Liked Authors: {outline.paramsUsed.likedAuthors.join(', ')}</li>
                      <li>Tone: {outline.paramsUsed.tone}</li>
                      <li>Reading Purpose: {outline.paramsUsed.readingPurpose}</li>
                      <li>Locale: {outline.paramsUsed.locale}</li>
                      {Object.entries(outline.paramsUsed.customParams || {}).length > 0 && (
                        <li>
                          Custom Parameters:
                          <ul className="ml-4 mt-1">
                            {Object.entries(outline.paramsUsed.customParams || {}).map(([key, value]) => (
                              <li key={key} className="text-gray-600">
                                {key}: {value}
                              </li>
                            ))}
                          </ul>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Prompt Used:</h3>
                    <p className="mt-2 text-gray-600 whitespace-pre-wrap">{outline.promptUsed}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Generated Outline:</h3>
                    <p className="mt-2 text-gray-600 whitespace-pre-wrap">{outline.outline}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
