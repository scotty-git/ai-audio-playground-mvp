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

// Function to split text into chunks that respect sentence boundaries
function splitTextIntoChunks(text: string, maxChunkSize: number = 4000): string[] {
  const chunks: string[] = [];
  let currentChunk = '';

  // Split into sentences (roughly) by looking for period + space or newline
  const sentences = text.split(/(?<=\.|\?|\!)\s+/);

  for (const sentence of sentences) {
    // If adding this sentence would exceed the chunk size, start a new chunk
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    currentChunk += sentence + ' ';
  }

  // Add the last chunk if there's anything left
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Function to merge audio buffers
async function mergeAudioBuffers(buffers: Buffer[]): Promise<Buffer> {
  // For MP3 files, we need to concatenate them properly
  // This is a simple concatenation - for production, you might want to use a proper audio processing library
  return Buffer.concat(buffers);
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

    // Split content into chunks
    const chunks = splitTextIntoChunks(content);
    const audioBuffers: Buffer[] = [];

    // Generate audio for each chunk
    for (const chunk of chunks) {
      const response = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: chunk,
      });

      const buffer = Buffer.from(await response.arrayBuffer());
      audioBuffers.push(buffer);
    }

    // Merge audio buffers
    const finalBuffer = await mergeAudioBuffers(audioBuffers);

    // Save the final audio file
    const fileName = `chapter-${chapterIndex}.mp3`;
    const filePath = path.join(outlineDir, fileName);
    fs.writeFileSync(filePath, finalBuffer);

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
    
    // Update the status to error in case of failure
    await updateResults(results => {
      return results.map(result => {
        if (result.id === outlineId && result.story && result.story.chapters) {
          const chapter = result.story.chapters[chapterIndex];
          if (chapter) {
            chapter.audioStatus = 'error';
          }
        }
        return result;
      });
    });
    
    throw error;
  }
}
