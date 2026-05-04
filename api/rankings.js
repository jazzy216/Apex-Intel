export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in environment variables' });
  }

  const { category, period } = req.body;

  if (!category || !period) {
    return res.status(400).json({ error: 'Missing category or period' });
  }

  const PL = {
    day:     'today (May 2026)',
    month:   'May 2026',
    year:    '2026',
    alltime: 'all time as of 2026'
  };

  const prompts = {
    ai:    `Rank the top 7 AI language/multimodal models for ${PL[period]}. Evaluate: benchmark scores (MMLU, HumanEval, GPQA), throughput, context length, multimodal skills, cost, API uptime.`,
    vps:   `Rank the top 7 VPS providers for ${PL[period]}. Evaluate: verified uptime %, network speed, NVMe I/O, support SLA, geographic coverage, DDoS protection, price-to-performance.`,
    vpn:   `Rank the top 7 VPN services for ${PL[period]} on security and privacy. Evaluate: third-party audits, no-logs enforcement, WireGuard/OpenVPN quality, kill-switch reliability, jurisdiction, server count.`,
    cloud: `Rank the top 7 cloud platforms for ${PL[period]}. Evaluate: contractual SLA %, actual measured uptime, incident history, compute benchmarks, service breadth, egress costs, enterprise support.`
  };

  if (!prompts[category]) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  const systemPrompt = `You are a senior technology analyst. Respond ONLY with raw JSON, no markdown fences, no explanation.

Return this exact structure:
{
  "rankings": [
    {
      "name": "Brand Name",
      "detail": "One differentiator phrase",
      "score": 95,
      "primaryMetric": "99.99%",
      "secondaryMetric": "30d uptime",
      "uptimePct": 99.99,
      "trend": "up",
      "highlight": "One analyst insight sentence max 12 words"
    }
  ],
  "summary": "Two sentence category overview.",
  "dataNote": "Brief methodology note."
}

Exactly 7 items. Real provider names. Accurate data. Score is weighted composite 0-100.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1200,
        system:     systemPrompt,
        messages:   [{ role: 'user', content: prompts[category] }]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Anthropic error:', response.status, text);
      return res.status(response.status).json({
        error: `Anthropic returned ${response.status}`,
        detail: text
      });
    }

    const data = await response.json();
    let raw = data.content.map(b => b.text || '').join('');
    raw = raw.replace(/```json|```/g, '').trim();

    const parsed = JSON.parse(raw);
    return res.status(200).json(parsed);

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
