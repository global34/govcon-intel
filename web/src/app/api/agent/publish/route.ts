import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// This API route allows the LangGraph/Paperclip agents to programmatically publish
// formatted "Signal" posts directly into the Keystatic headless CMS directory.

export async function POST(request: Request) {
  try {
    // 1. Authenticate the agent request
    const authHeader = request.headers.get('authorization');
    const agentApiKey = process.env.AGENT_API_KEY;

    // If AGENT_API_KEY is not configured, behave like the route doesn't exist.
    if (!agentApiKey) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    if (authHeader !== `Bearer ${agentApiKey}`) {
      return NextResponse.json({ error: 'Unauthorized agent' }, { status: 401 });
    }

    // 2. Parse the payload
    const body = await request.json();
    const { title, summary, category = 'opportunities', content, date } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content' },
        { status: 400 }
      );
    }

    // 3. Format the data for Keystatic
    const publishDate = date || new Date().toISOString().split('T')[0];
    
    // Generate a simple slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Keystatic Markdoc (.mdoc) format with YAML frontmatter
    const fileContent = `---
title: ${JSON.stringify(title)}
date: '${publishDate}'
summary: ${JSON.stringify(summary || '')}
category: ${category}
---

${content}
`;

    // 4. Write the file to the local content directory
    const contentDir = path.join(process.cwd(), 'src/content/signals');
    
    // Ensure the directory exists
    await fs.mkdir(contentDir, { recursive: true });

    const filePath = path.join(contentDir, `${slug}.mdoc`);
    await fs.writeFile(filePath, fileContent, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Signal successfully posted by agent',
      slug,
      path: filePath,
    });

  } catch (error: any) {
    console.error('Agent publish error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
