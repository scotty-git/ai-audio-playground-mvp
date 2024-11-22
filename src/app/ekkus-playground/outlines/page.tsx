'use client'

import { useState, useEffect } from 'react';
import { StoryGenerator } from '../components/story-generator';
import type { OutlineResult, Story } from '../types';

export default function OutlinesPage() {
  const [outlines, setOutlines] = useState<OutlineResult[]>([]);
  const [expandedOutlines, setExpandedOutlines] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const loadOutlines = async () => {
      try {
        const response = await fetch('/api/outlines');
        const data = await response.json();
        setOutlines(data);
      } catch (error) {
        console.error('Error loading outlines:', error);
      }
    };

    loadOutlines();
  }, []);

  const toggleOutline = (index: number) => {
    setExpandedOutlines(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleStoryUpdate = async (index: number, story: Story) => {
    const updatedOutlines = [...outlines];
    updatedOutlines[index] = {
      ...updatedOutlines[index],
      story
    };
    setOutlines(updatedOutlines);

    try {
      await fetch('/api/outlines', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOutlines),
      });
    } catch (error) {
      console.error('Error saving story:', error);
    }
  };

  if (!outlines.length) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Generated Outlines</h1>
      
      <div className="space-y-8">
        {outlines.map((result, index) => (
          <div key={index} className="border rounded-lg p-6 bg-white shadow-sm">
            <button
              onClick={() => toggleOutline(index)}
              className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold">
                Outline {index + 1}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  {new Date(result.timestamp).toLocaleString()}
                </span>
              </h2>
              <span className="text-gray-500">
                {expandedOutlines[index] ? '▼' : '▶'}
              </span>
            </button>
            {expandedOutlines[index] && (
              <div className="p-6 pt-0 space-y-4 border-t">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Outline</h2>
                  <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
                    {result.outline}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Parameters Used</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p><strong>Age:</strong> {result.paramsUsed.age}</p>
                      <p><strong>Genre:</strong> {result.paramsUsed.genre}</p>
                      <p><strong>Tone:</strong> {result.paramsUsed.tone}</p>
                      <p><strong>Reading Purpose:</strong> {result.paramsUsed.readingPurpose}</p>
                    </div>
                    <div>
                      <p><strong>Interests:</strong> {result.paramsUsed.interests.join(', ')}</p>
                      <p><strong>Liked Authors:</strong> {result.paramsUsed.likedAuthors.join(', ')}</p>
                      {result.paramsUsed.customParams && Object.keys(result.paramsUsed.customParams).length > 0 && (
                        <div>
                          <strong>Custom Parameters:</strong>
                          <ul>
                            {Object.entries(result.paramsUsed.customParams).map(([key, value]) => (
                              <li key={key}>
                                {key}: {value}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700">Prompt Used:</h3>
                  <p className="mt-2 text-gray-600 whitespace-pre-wrap">{result.promptUsed}</p>
                </div>

                <StoryGenerator 
                  outline={result} 
                  onUpdate={(story) => handleStoryUpdate(index, story)} 
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
