import { NextResponse, NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const RESULTS_FILE = path.join(process.cwd(), 'src/app/ekkus-playground/results.json');

function generateId(): string {
  return crypto.randomBytes(16).toString('hex');
}

async function readOutlines() {
  try {
    const content = await fs.readFile(RESULTS_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading outlines:', error);
    return [];
  }
}

async function writeOutlines(outlines: any[]) {
  try {
    // Ensure we're working with an array
    if (!Array.isArray(outlines)) {
      throw new Error('Outlines must be an array');
    }

    // Validate and clean each outline
    const validatedOutlines = outlines.map(outline => {
      // Ensure each outline has an ID
      if (!outline.id) {
        outline.id = generateId();
      }

      // Ensure story structure is valid if it exists
      if (outline.story) {
        outline.story = {
          chapters: Array.isArray(outline.story.chapters) ? outline.story.chapters : [],
          status: outline.story.status || 'generating',
          currentChapter: outline.story.currentChapter || 0,
          totalChapters: outline.story.totalChapters || 5,
          audioStatus: outline.story.audioStatus || 'generating',
          currentAudioChapter: outline.story.currentAudioChapter || 0
        };
      }

      return outline;
    });

    // Write the validated JSON
    const validJSON = JSON.stringify(validatedOutlines, null, 2);
    await fs.writeFile(RESULTS_FILE, validJSON);
    return true;
  } catch (error) {
    console.error('Error writing outlines:', error);
    return false;
  }
}

export async function GET() {
  try {
    const data = await readOutlines();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading outlines:', error);
    return NextResponse.json({ error: 'Failed to read outlines' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const outlines = await request.json();
    const success = await writeOutlines(outlines);
    
    if (!success) {
      throw new Error('Failed to write outlines');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating outlines:', error);
    return NextResponse.json({ error: 'Failed to update outlines' }, { status: 500 });
  }
}
