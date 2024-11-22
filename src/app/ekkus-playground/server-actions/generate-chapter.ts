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
  try {
    const prompt = `
You are writing chapter ${chapterIndex + 1} of ${totalChapters} for a story.

Story Outline:
${outline}

${previousChapter ? `Previous Chapter:\n${previousChapter}\n\n` : ''}

Write a detailed, engaging chapter that:
1. Maintains consistency with the outline
2. Flows naturally from the previous chapter (if provided)
3. Uses vivid descriptions and engaging dialogue
4. Ends in a way that leads smoothly into the next chapter (unless it's the final chapter)

Write only the chapter content, without any chapter numbers or titles.
`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
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
