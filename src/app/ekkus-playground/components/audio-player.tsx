'use client'

import React, { useState } from 'react';
import { generateChapterAudio } from '../server-actions/generate-audio';
import type { Chapter, Story } from '../types';

interface AudioPlayerProps {
  chapter: Chapter;
  outlineId: string;
  onAudioGenerated: (chapterIndex: number, audioUrl: string) => void;
}

export function AudioPlayer({ chapter, outlineId, onAudioGenerated }: AudioPlayerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAudio = async () => {
    if (!outlineId) {
      setError('Outline ID is required for audio generation');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateChapterAudio(
        chapter.content,
        chapter.index,
        outlineId
      );
      onAudioGenerated(result.chapterIndex, result.audioUrl);
    } catch (error) {
      console.error('Error generating audio:', error);
      setError('Failed to generate audio. Please try again.');
    }
    setIsGenerating(false);
  };

  if (isGenerating) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
        Generating audio...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        {error}
        <button
          onClick={() => setError(null)}
          className="ml-2 text-blue-500 hover:text-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!chapter.audioUrl) {
    return (
      <button
        onClick={handleGenerateAudio}
        className="text-sm text-blue-500 hover:text-blue-600"
      >
        Generate Audio
      </button>
    );
  }

  return (
    <audio controls className="h-8">
      <source src={chapter.audioUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
}
