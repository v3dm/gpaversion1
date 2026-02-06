export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return res.status(500).json({ error: "Server not configured" });
  }

  try {
    const apiRes = await fetch(`${url}/incr/visits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiRes.ok) {
      const text = await apiRes.text();
      return res.status(500).json({ error: "Upstash error", details: text });
    }

    const data = await apiRes.json();
    return res.status(200).json({ count: data.result });
  } catch (err) {
    return res.status(500).json({ error: "Unexpected error" });
  }
}
