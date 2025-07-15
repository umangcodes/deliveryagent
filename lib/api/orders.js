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
  
// /lib/api/orders.js

export async function confirmDeliveryWithProof(orderId, file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('orderId', orderId);

  const res = await fetch(`${process.env.BACKEND_API}/orders/confirm-delivery-with-proof`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  return await res.json(); // Expected: { signedUrl, messageId, etc. }
}

export async function fetchSignedUrl (path){
  const res = await fetch(`${process.env.BACKEND_API}/orders/order/proof-url?path=${encodeURIComponent(path)}`);
  if (!res.ok) throw new Error('Failed to fetch signed URL');
  const data = await res.json();
  return data.signedUrl;
};
