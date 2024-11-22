import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const resultsPath = path.join(process.cwd(), 'src/app/ekkus-playground/results.json');
    const fileContents = fs.readFileSync(resultsPath, 'utf8');
    const data = JSON.parse(fileContents);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading outlines:', error);
    return NextResponse.json({ error: 'Failed to fetch outlines' }, { status: 500 });
  }
}
