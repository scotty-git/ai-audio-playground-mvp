'use client'

import React, { useState } from 'react';
import { generateChapter } from '../server-actions/generate-chapter';
import { AudioPlayer } from './audio-player';
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
      totalChapters: CHAPTERS_PER_STORY,
      audioStatus: 'generating',
      currentAudioChapter: 0
    };
    
    onUpdate(story);

    try {
      for (let i = 0; i < CHAPTERS_PER_STORY; i++) {
        const chapter: Chapter = {
          content: '',
          index: i,
          status: 'generating',
          audioStatus: 'generating'
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

        // For the last chapter, update both chapter and story status together
        if (i === CHAPTERS_PER_STORY - 1) {
          story.status = 'completed';
        }

        // Create a new story object for each update to ensure clean state
        const updatedStory = {
          ...story,
          chapters: [...story.chapters],
          currentChapter: i,
          status: i === CHAPTERS_PER_STORY - 1 ? 'completed' : 'generating'
        };
        
        onUpdate(updatedStory);
      }
    } catch (error) {
      console.error('Error generating story:', error);
      const errorStory = {
        ...story,
        status: 'error',
        chapters: [...story.chapters]
      };
      onUpdate(errorStory);
    }

    setIsGenerating(false);
  };

  const handleAudioGenerated = (chapterIndex: number, audioUrl: string) => {
    if (!outline.story) return;

    // Create a new story object with a fresh chapters array
    const updatedStory = {
      ...outline.story,
      chapters: outline.story.chapters.map(ch => ({ ...ch }))
    };

    const chapter = updatedStory.chapters[chapterIndex];
    if (chapter) {
      chapter.audioUrl = audioUrl;
      chapter.audioStatus = 'completed';
    }
    
    // Update audio generation progress
    updatedStory.currentAudioChapter = chapterIndex;
    
    // Check if all chapters have audio
    const allChaptersHaveAudio = updatedStory.chapters.every(
      chapter => chapter.audioStatus === 'completed'
    );
    
    if (allChaptersHaveAudio) {
      updatedStory.audioStatus = 'completed';
    }

    onUpdate(updatedStory);
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
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Chapter {index + 1}</h3>
            {chapter.content && outline.id && (
              <AudioPlayer
                chapter={chapter}
                outlineId={outline.id}
                onAudioGenerated={handleAudioGenerated}
              />
            )}
          </div>
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
