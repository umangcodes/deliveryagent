export async function punchIn(name, type) {
    const res = await fetch(`${process.env.BACKEND_API}/punch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type }),
    });
  
    const data = await res.json();
    if (!res.ok && !data.warning) throw new Error(data.error || 'Punch failed');
    return data;
  }
  