'use server'

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RESULTS_FILE = path.join(process.cwd(), 'src/app/ekkus-playground/results.json');

async function updateResults(updater: (results: any[]) => any[]) {
  try {
    // Read the current results
    const content = await fsPromises.readFile(RESULTS_FILE, 'utf8');
    const results = JSON.parse(content);

    // Apply the update
    const updatedResults = updater(results);

    // Write back the updated results
    await fsPromises.writeFile(RESULTS_FILE, JSON.stringify(updatedResults, null, 2));
  } catch (error) {
    console.error('Error updating results:', error);
    throw error;
  }
}

export async function generateChapterAudio(
  content: string,
  chapterIndex: number,
  outlineId: string
) {
  if (!outlineId) {
    throw new Error('Outline ID is required');
  }

  try {
    // Create directory for audio files if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public');
    const audioBaseDir = path.join(publicDir, 'audio');
    const outlineDir = path.join(audioBaseDir, outlineId);

    // Create directories if they don't exist
    fs.mkdirSync(publicDir, { recursive: true });
    fs.mkdirSync(audioBaseDir, { recursive: true });
    fs.mkdirSync(outlineDir, { recursive: true });

    // Generate audio file
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: content,
    });

    // Save audio file
    const buffer = Buffer.from(await response.arrayBuffer());
    const fileName = `chapter-${chapterIndex}.mp3`;
    const filePath = path.join(outlineDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // Generate the URL for the audio file
    const audioUrl = `/audio/${outlineId}/${fileName}`;

    // Update the results file
    await updateResults(results => {
      return results.map(result => {
        if (result.id === outlineId && result.story && result.story.chapters) {
          const chapter = result.story.chapters[chapterIndex];
          if (chapter) {
            chapter.audioUrl = audioUrl;
            chapter.audioStatus = 'completed';
          }
          result.story.currentAudioChapter = chapterIndex;
          
          // Check if all chapters have audio
          const allChaptersHaveAudio = result.story.chapters.every(
            (ch: any) => ch.audioStatus === 'completed'
          );
          
          if (allChaptersHaveAudio) {
            result.story.audioStatus = 'completed';
          }
        }
        return result;
      });
    });
    
    return {
      chapterIndex,
      audioUrl,
    };
  } catch (error) {
    console.error('Error generating audio:', error);
    throw error;
  }
}
