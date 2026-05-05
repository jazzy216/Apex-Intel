// pages/api/rankings.js
export default async function handler(req, res) {
  // CORS headers — allow your frontend to call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set');
    return res.status(500).json({ 
      error: 'API key not configured',
      hint: 'Set ANTHROPIC_API_KEY in Vercel environment variables'
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: `You are APEX INTEL, a live technology intelligence engine. 
You rank the best platforms in 4 categories: AI Models, VPS Providers, VPN Services, Cloud Platforms.
Rankings are based on current performance, value, reliability, and real-world usage in 2026.
Respond ONLY with valid JSON — no markdown, no backticks, no preamble.`,
        messages: [{
          role: 'user',
          content: `Generate current rankings for today's date. Return this exact JSON structure:
{
  "generated": "<ISO timestamp>",
  "period": "today",
  "categories": {
    "ai_models": [
      { "rank": 1, "name": "Claude Sonnet 4", "provider": "Anthropic", "score": 97, "tag": "Best Overall", "metrics": { "speed": "Fast", "context": "200k", "cost": "$$", "strengths": "Reasoning, coding, analysis" } },
      { "rank": 2, "name": "GPT-4o", "provider": "OpenAI", "score": 93, "tag": "Best Multimodal", "metrics": { "speed": "Fast", "context": "128k", "cost": "$$$", "strengths": "Vision, function calling" } },
      { "rank": 3, "name": "Gemini 1.5 Pro", "provider": "Google", "score": 89, "tag": "Best Free Tier", "metrics": { "speed": "Medium", "context": "1M", "cost": "Free/$", "strengths": "Long context, multimodal" } },
      { "rank": 4, "name": "Llama 3.3 70B", "provider": "Meta", "score": 85, "tag": "Best Open Source", "metrics": { "speed": "Varies", "context": "128k", "cost": "Free", "strengths": "Self-hosted, privacy" } },
      { "rank": 5, "name": "Mistral Large", "provider": "Mistral", "score": 82, "tag": "Best EU Option", "metrics": { "speed": "Fast", "context": "128k", "cost": "$$", "strengths": "European data residency" } }
    ],
    "vps_providers": [
      { "rank": 1, "name": "Hetzner", "score": 96, "tag": "Best Value", "metrics": { "uptime": "99.99%", "price": "$4/mo", "location": "EU/US", "strengths": "Price/performance unmatched" } },
      { "rank": 2, "name": "DigitalOcean", "score": 91, "tag": "Best DX", "metrics": { "uptime": "99.99%", "price": "$6/mo", "location": "Global", "strengths": "Developer experience, docs" } },
      { "rank": 3, "name": "Vultr", "score": 88, "tag": "Best Global Coverage", "metrics": { "uptime": "99.98%", "price": "$5/mo", "location": "32 locations", "strengths": "Global edge presence" } },
      { "rank": 4, "name": "Linode/Akamai", "score": 85, "tag": "Most Reliable", "metrics": { "uptime": "99.99%", "price": "$5/mo", "location": "Global", "strengths": "Enterprise SLAs" } },
      { "rank": 5, "name": "OVHcloud", "score": 80, "tag": "Best Bare Metal", "metrics": { "uptime": "99.97%", "price": "$3.50/mo", "location": "EU/NA", "strengths": "Dedicated options, EU compliance" } }
    ],
    "vpn_services": [
      { "rank": 1, "name": "Mullvad", "score": 97, "tag": "Most Private", "metrics": { "logs": "Zero", "price": "€5/mo flat", "protocols": "WireGuard/OpenVPN", "strengths": "Anonymous accounts, no email needed" } },
      { "rank": 2, "name": "ProtonVPN", "score": 93, "tag": "Best Free Tier", "metrics": { "logs": "Zero", "price": "Free/$8", "protocols": "WireGuard/OpenVPN", "strengths": "Swiss law, open source" } },
      { "rank": 3, "name": "IVPN", "score": 89, "tag": "Best for Privacy Pros", "metrics": { "logs": "Zero", "price": "$6/mo", "protocols": "WireGuard/OpenVPN", "strengths": "AntiTracker, multi-hop" } },
      { "rank": 4, "name": "NordVPN", "score": 84, "tag": "Best for Streaming", "metrics": { "logs": "Zero", "price": "$3.99/mo", "protocols": "NordLynx/OpenVPN", "strengths": "6000+ servers, fast speeds" } },
      { "rank": 5, "name": "ExpressVPN", "score": 80, "tag": "Easiest to Use", "metrics": { "logs": "Zero", "price": "$8.32/mo", "protocols": "Lightway", "strengths": "Router support, 24/7 support" } }
    ],
    "cloud_platforms": [
      { "rank": 1, "name": "Cloudflare", "score": 95, "tag": "Best Edge Network", "metrics": { "uptime": "99.99%", "free_tier": "Generous", "global_pops": "300+", "strengths": "Workers, R2, Pages, Zero Trust" } },
      { "rank": 2, "name": "AWS", "score": 92, "tag": "Most Mature", "metrics": { "uptime": "99.99%", "free_tier": "12 months", "global_pops": "33 regions", "strengths": "Widest service catalog" } },
      { "rank": 3, "name": "Google Cloud", "score": 88, "tag": "Best AI/ML Platform", "metrics": { "uptime": "99.99%", "free_tier": "$300 credit", "global_pops": "40 regions", "strengths": "Vertex AI, BigQuery" } },
      { "rank": 4, "name": "Azure", "score": 86, "tag": "Best Enterprise", "metrics": { "uptime": "99.99%", "free_tier": "$200 credit", "global_pops": "60+ regions", "strengths": "M365 integration, hybrid cloud" } },
      { "rank": 5, "name": "Oracle Cloud", "score": 79, "tag": "Best Free Forever", "metrics": { "uptime": "99.95%", "free_tier": "Always free ARM", "global_pops": "41 regions", "strengths": "Free 4 ARM CPUs / 24GB RAM" } }
    ]
  }
}`
        }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return res.status(response.status).json({ 
        error: 'Anthropic API error', 
        status: response.status,
        detail: errText 
      });
    }

    const data = await response.json();
    const rawText = data.content[0].text.trim();

    // Strip any accidental markdown fences
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const rankings = JSON.parse(cleaned);

    // Cache for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json(rankings);

  } catch (err) {
    console.error('Rankings handler error:', err);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: err.message 
    });
  }
}
