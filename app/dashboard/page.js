'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { verifyAccessCode } from '../../lib/api/auth';
import { fetchOrdersByArea } from '../../lib/api/orders';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const accessCode = Cookies.get('accessCode');
    const areaCode = Cookies.get('areaCode');

    if (!accessCode || !areaCode) {
      router.push('/access-code');
      return;
    }

    const validateAndFetch = async () => {
      try {
        const validated = await verifyAccessCode(accessCode);
        if (validated.areaCode !== areaCode) throw new Error('Access code mismatch');
        const orders = await fetchOrdersByArea(areaCode);
        setOrders(orders);
        setLoading(false);
      } catch (err) {
        Cookies.remove('accessCode');
        Cookies.remove('areaCode');
        router.push('/access-code');
      }
    };

    validateAndFetch();
    console.log(orders)
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">📦 Today's Deliveries</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found for today.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order, idx) => (
            <Dialog key={idx}>
              <DialogTrigger asChild>
                <Card
                  onClick={() => setSelectedOrder(order)}
                  className="hover:shadow-lg transition cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle>{order.comments[0].comment}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-gray-700">
                    <p>
                      <strong>Phone:</strong> {order.customerPrimaryPhoneNumber}
                    </p>
                    <p className="hover:text-blue-600 underline cursor-pointer">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress?.addressInfo || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {order.deliveryAddress?.addressInfo || 'No address'}
                      </a>
                    </p>
                    <p>Qty: {order.items?.tiffin}</p>
                    {order.specialItems?.length > 0 && (
                      <p className="text-blue-500">Special: {order.specialItems.join(', ')}</p>
                    )}
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Name: {order.comments[0].comment}</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <p><strong>Address:</strong> {order.deliveryAddress?.addressInfo}</p>
                  <p><strong>Phone:</strong> {order.customerPrimaryPhoneNumber}</p>
                  <p><strong>Delivery Notes:</strong> {order.deliveryAddress?.deliveryType}</p>
                  <p><strong>Tiffin Qty:</strong> {order.items?.tiffin}</p>
                  {order.specialItems?.length > 0 && (
                    <p><strong>Special Items:</strong> {order.specialItems.join(', ')}</p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button variant="default" onClick={() => window.open(`tel:${order.customerPrimaryPhoneNumber}`)}>📞 Call</Button>
                    <Button variant="secondary" onClick={() => window.open(`sms:${order.customerPrimaryPhoneNumber}`)}>💬 Text</Button>
                    <Button variant="outline" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress?.addressInfo || '')}`, '_blank')}>📍 View Map</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}
