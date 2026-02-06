export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return res.status(500).json({ error: "Server not configured" });
  }

  const increment =
    req.query && Object.prototype.hasOwnProperty.call(req.query, "increment")
      ? req.query.increment !== "0"
      : true;

  try {
    const endpoint = increment ? "incr" : "get";
    const apiRes = await fetch(`${url}/${endpoint}/visits`, {
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
    const count = data.result === null ? 0 : data.result;
    return res.status(200).json({ count });
  } catch (err) {
    return res.status(500).json({ error: "Unexpected error" });
  }
}
