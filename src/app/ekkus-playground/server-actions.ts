'use server'

import fs from 'fs';
import path from 'path';
import { INITIAL_FORM_DATA } from './playground-form';
import OpenAI from 'openai';

const client = new OpenAI();

/**
 * Accepts an object of parameters for a book outline
 * Combines the parameters to create a prompt suitable for LLM to generate an outline for a book
 * returns paramsUsed, promptUsed, and the resulting outline
 */
export async function generateOutline(data: typeof INITIAL_FORM_DATA) {
  const {outline, promptUsed} = await _generateOutline(data);
  const resultsPath = path.join(process.cwd(), 'src/app/ekkus-playground/results.json');
  
  // Read existing outlines or initialize empty array
  let outlines = [];
  try {
    const existingData = fs.readFileSync(resultsPath, 'utf8');
    outlines = JSON.parse(existingData);
    if (!Array.isArray(outlines)) {
      outlines = [outlines]; // Convert single object to array
    }
  } catch (error) {
    // File doesn't exist or is empty, start with empty array
    outlines = [];
  }

  // Add new outline with timestamp
  outlines.push({
    outline,
    promptUsed,
    paramsUsed: data,
    timestamp: new Date().toISOString()
  });

  // Write back to file
  fs.writeFileSync(resultsPath, JSON.stringify(outlines, null, 2));

  return outline;
}

/**
 * Takes in a prompt and uses it to generate an outline for a book,
 * uses LLM to generate the outline
 * returns the outline
 */
async function _generateOutline(data: typeof INITIAL_FORM_DATA) {
    console.log('GENERATING OUTLINE...');
    const prompt = await _generatePrompt( data,  'Please combine the following into a propmt usable by an LLM. Based on the prompt the LLM should be able to create a novel outline that`s customised per the given user parameters. It`s crucial that the LLM knows not to generate generic content, but rather focus on creating unique and timely content.');
    const result = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    });
    const res = result.choices[0].message.content;
    if(!res) {
        throw new Error('Failed to generate outline');
    }

    console.log('OUTLINE GENERATED');
    
   return {
    outline: res,
    promptUsed: prompt
   };
}

/**
 * Helper which takes in an object with any parameters,
 * passes the parameters for openai to combine into a prompt suitable for LLM
 * returns prompt
 */
async function _generatePrompt( data: typeof INITIAL_FORM_DATA, base='Please combine the following into a propmt usable by an LLM') {
    console.log('GENERATING PROMPT...');
    const result = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'user',
                content: base,
            },
            {
                role: 'user',
                content: JSON.stringify(data),
            },
        ],
    });
    const res = result.choices[0].message.content;
    if(!res) {
        throw new Error('Failed to generate prompt');
    }

    console.log('PROMPT GENERATED');
    
   return res;
}