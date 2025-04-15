export async function verifyAccessCode(accessCode) {
    const res = await fetch(`${process.env.BACKEND_API}/auth/access-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessCode }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Access code invalid');
    return data;
  }
  