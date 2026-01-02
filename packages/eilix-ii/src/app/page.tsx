'use client';

import { useState } from 'react';

export default function EILIX() {
  const [topic, setTopic] = useState('');
  const [tweet, setTweet] = useState('');
  const [loading, setLoading] = useState(false);

  const generateTweet = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setTweet('');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() })
      });
      
      const data = await response.json() as { tweet?: string };
      setTweet(data.tweet || 'Failed to generate tweet');
    } catch {
      setTweet('Error generating tweet');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateTweet();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-5xl font-bold mb-2 text-center">EILIX</h1>
        <p className="text-gray-400 text-center mb-12">Explain anything like a viral tweet</p>
        
        <div className="space-y-6">
          <div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter any topic..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-zinc-600 transition-colors"
              disabled={loading}
            />
          </div>
          
          <button
            onClick={generateTweet}
            disabled={loading || !topic.trim()}
            className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Tweet'}
          </button>
          
          {tweet && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mt-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold mb-1">EILIX</div>
                  <p className="text-lg leading-relaxed">{tweet}</p>
                  <div className="text-sm text-gray-500 mt-3">{tweet.length} characters</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



