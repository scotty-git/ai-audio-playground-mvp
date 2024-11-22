'use client'

import React, { useState } from 'react';
import { generateChapter } from '../server-actions/generate-chapter';
import type { OutlineResult, Story, Chapter } from '../types';

interface StoryGeneratorProps {
  outline: OutlineResult;
  onUpdate: (story: Story) => void;
}

const CHAPTERS_PER_STORY = 5;

export function StoryGenerator({ outline, onUpdate }: StoryGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateStory = async () => {
    setIsGenerating(true);
    
    const story: Story = {
      chapters: [],
      status: 'generating',
      currentChapter: 0,
      totalChapters: CHAPTERS_PER_STORY
    };
    
    onUpdate(story);

    try {
      for (let i = 0; i < CHAPTERS_PER_STORY; i++) {
        const chapter: Chapter = {
          content: '',
          index: i,
          status: 'generating'
        };
        
        story.chapters[i] = chapter;
        story.currentChapter = i;
        onUpdate({ ...story });

        const previousChapter = i > 0 ? story.chapters[i - 1].content : undefined;
        const content = await generateChapter(
          outline.outline,
          i,
          CHAPTERS_PER_STORY,
          previousChapter
        );

        chapter.content = content;
        chapter.status = 'completed';
        onUpdate({ ...story });
      }

      story.status = 'completed';
      onUpdate({ ...story });
    } catch (error) {
      console.error('Error generating story:', error);
      story.status = 'error';
      onUpdate({ ...story });
    }

    setIsGenerating(false);
  };

  const progress = outline.story 
    ? Math.round((outline.story.currentChapter + 1) / CHAPTERS_PER_STORY * 100)
    : 0;

  return (
    <div className="mt-4">
      {!outline.story && (
        <button
          onClick={generateStory}
          disabled={isGenerating}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Generate Full Story
        </button>
      )}

      {outline.story && outline.story.status === 'generating' && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-2 bg-gray-200 rounded">
              <div 
                className="h-full bg-green-500 rounded transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
          <p className="text-sm text-gray-600">
            Generating chapter {outline.story.currentChapter + 1} of {CHAPTERS_PER_STORY}...
          </p>
        </div>
      )}

      {outline.story?.chapters.map((chapter, index) => (
        <div key={index} className="mt-4">
          <h3 className="font-bold mb-2">Chapter {index + 1}</h3>
          <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
            {chapter.content || 'Generating...'}
          </div>
        </div>
      ))}

      {outline.story?.status === 'error' && (
        <p className="text-red-500 mt-2">
          Error generating story. Please try again.
        </p>
      )}
    </div>
  );
}
