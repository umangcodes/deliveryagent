export async function fetchOrdersByArea(areaCode) {
    const res = await fetch(`${process.env.BACKEND_API}/auth/orders/${areaCode}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
    return data.orders;
  }
  

  export async function confirmDelivery(orderId) {
    try {
      const res = await fetch(`${process.env.BACKEND_API}/orders/confirm-delivery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });
  
      if (!res.ok) throw new Error('Failed to confirm delivery');
      return await res.json();
    } catch (error) {
      console.error('Delivery confirmation failed:', error);
      throw error;
    }
  }
  