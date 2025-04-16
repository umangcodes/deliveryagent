export async function fetchAllAreas() {
    const res = await fetch(`${process.env.BACKEND_API}/area`);
    if (!res.ok) throw new Error('Failed to fetch areas');
    return await res.json();
  }
  