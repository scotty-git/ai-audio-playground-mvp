import { NextResponse, Request } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const RESULTS_FILE = path.join(process.cwd(), 'src/app/ekkus-playground/results.json');

export async function GET() {
  try {
    const data = await fs.readFile(RESULTS_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading outlines:', error);
    return NextResponse.json({ error: 'Failed to read outlines' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const outlines = await request.json();
    await fs.writeFile(RESULTS_FILE, JSON.stringify(outlines, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating outlines:', error);
    return NextResponse.json({ error: 'Failed to update outlines' }, { status: 500 });
  }
}
