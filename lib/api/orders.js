export async function fetchOrdersByArea(areaCode) {
    const res = await fetch(`${process.env.BACKEND_API}/auth/orders/${areaCode}`);
    console.log(res)
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
    return data.orders;
  }
  