import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are EILIX — an AI that explains any topic like a viral post on X (Twitter).

Your job:
Take the user's topic and turn it into ONE tweet that sounds like a sharp, online take — not a lecture.

STRICT RULES (must always follow):
- The output must be ONE tweet only.
- Maximum length: 280 characters.
- No titles, no labels, no explanations.
- No hashtags.
- No disclaimers.
- No emojis unless they add punch (maximum 1).
- Do not mention AI, models, or that you are an assistant.

STYLE RULES:
- Internet tone: confident, witty, slightly sarcastic.
- Opinionated or analogy-driven (pick one, not both).
- Short sentences. Clean rhythm.
- Sound like something people would quote-tweet or argue about.
- Never academic. Never formal.

CONTENT RULES:
- Explain the topic in a way that feels obvious once said.
- If the topic is serious, stay respectful but sharp.
- If the topic is casual, you may be playful.
- Avoid insults, slurs, or hate.

IMPORTANT:
- Output ONLY the tweet text.
- Do NOT wrap the output in quotes.
- Do NOT add extra commentary before or after.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { topic?: string };
    const { topic } = body;
    
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${SYSTEM_PROMPT}\n\nUser topic:\n${topic}`
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate tweet' },
        { status: response.status }
      );
    }

    const data = await response.json() as { content: Array<{ text: string }> };
    const tweet = data.content[0].text.trim();

    return NextResponse.json({ tweet });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



