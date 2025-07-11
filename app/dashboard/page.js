'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { verifyAccessCode } from '../../lib/api/auth';
import { fetchOrdersByArea, confirmDelivery } from '../../lib/api/orders';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import OrderCard from '@/components/card/OrderCard';
import OrderDialog from '@/components/card/OrderDialog';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(null); // null | 'specials'

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
  }, []);

  const totalTiffins = orders.reduce((acc, order) => acc + (order.items?.tiffin || 0), 0);
  const specialCount = orders.filter(order => order.specialItems?.length > 0).length;

  const toggleSpecialFilter = () => {
    setFilter(prev => (prev === 'specials' ? null : 'specials'));
  };

  const resetFilter = () => {
    setFilter(null);
  };

  const handleDelivery = async (orderId) => {
    try {
      await confirmDelivery(orderId);
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: 'delivered' } : order
        )
      );
    } catch (error) {
      alert('❌ Failed to confirm delivery');
    }
  };

  const filteredOrders =
    filter === 'specials'
      ? orders.filter(o => o.specialItems?.length > 0)
      : orders;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">Today's Deliveries</h1>

      {!loading && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card
            className={`py-2 px-4 cursor-pointer border-2 ${
              filter === null ? 'border-primary' : 'border-transparent'
            }`}
            onClick={resetFilter}
          >
            <CardHeader className="p-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                📦 Regular Tiffins
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-green-600 p-2">
              {totalTiffins}
            </CardContent>
          </Card>

          <Card
            className={`py-2 px-4 cursor-pointer border-2 ${
              filter === 'specials' ? 'border-yellow-500' : 'border-transparent'
            }`}
            onClick={toggleSpecialFilter}
          >
            <CardHeader className="p-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                🌟 Special Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-yellow-600 p-2">
              {specialCount}
            </CardContent>
          </Card>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found for today.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...filteredOrders]
            .sort((a, b) => (a.stopNumber || 0) - (b.stopNumber || 0))
            .map((order, index) => (
              <div key={index}>
                <OrderDialog order={order} handleStatusUpdate={handleDelivery}>
                  <OrderCard order={order} />
                </OrderDialog>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
