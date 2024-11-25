'use server'

import { OpenAI } from 'openai';
import { promises as fs } from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RESULTS_FILE = path.join(process.cwd(), 'src/app/ekkus-playground/results.json');

async function updateResults(updater: (results: any[]) => any[]) {
  try {
    // Read the current results
    const content = await fs.readFile(RESULTS_FILE, 'utf8');
    const results = JSON.parse(content);

    // Apply the update
    const updatedResults = updater(results);

    // Write back the updated results
    await fs.writeFile(RESULTS_FILE, JSON.stringify(updatedResults, null, 2));
  } catch (error) {
    console.error('Error updating results:', error);
    throw error;
  }
}

export async function generateChapter(
  outline: string,
  chapterIndex: number,
  totalChapters: number,
  previousChapter?: string
) {
  // The outline parameter is already the outline object
  const outlineObj = outline;
  const params = outlineObj.paramsUsed || {};
  const specialInterests = params.customParams?.['special-interest-book'] || '';
  
  const prompt = `
You are writing chapter ${chapterIndex + 1} of ${totalChapters} for a ${params.genre || 'story'}.
The story should be tailored for a ${params.age}-year-old reader.
The tone should be ${params.tone || 'neutral'}.
The purpose is for ${params.readingPurpose || 'entertainment'}.
The story should draw inspiration from authors like ${(params.likedAuthors || []).join(', ')}.
Main interests to focus on: ${(params.interests || []).join(', ')}.
${specialInterests ? `Special interest to incorporate: ${specialInterests}` : ''}

Here is the story outline:
${outlineObj.outline}

${previousChapter ? `Previous chapter content for context:
${previousChapter}

Please continue the story naturally from this point.` : 'This is the first chapter. Please begin the story.'}

Write an engaging and cohesive chapter that maintains consistency with the outline and previous content.
The chapter should be approximately 1000-1500 words.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional writer crafting a chapter for a story."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content || '';

    // Update the results file
    await updateResults(results => {
      return results.map(result => {
        if (result.story && result.story.chapters) {
          const chapter = result.story.chapters[chapterIndex];
          if (chapter) {
            chapter.content = content;
            chapter.status = 'completed';
          }
        }
        return result;
      });
    });

    return content;
  } catch (error) {
    console.error('Error generating chapter:', error);
    throw new Error('Failed to generate chapter');
  }
}
