'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { verifyAccessCode } from '../../lib/api/auth';
import { fetchOrdersByArea, confirmDelivery } from '../../lib/api/orders';

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
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const loadOrders = async () => {
    try {
      const accessCode = Cookies.get('accessCode');
      const areaCode = Cookies.get('areaCode');
      const validated = await verifyAccessCode(accessCode);
      if (validated.areaCode !== areaCode) throw new Error('Access code mismatch');
      const freshOrders = await fetchOrdersByArea(areaCode);
      setOrders(freshOrders);
      setLoading(false);
    } catch (err) {
      Cookies.remove('accessCode');
      Cookies.remove('areaCode');
      router.push('/access-code');
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const totalTiffins = orders.reduce((acc, order) => acc + (order.items?.tiffin || 0), 0);
  const specialCount = orders.filter(order => order.specialItems?.length > 0).length;

  const handleDelivery = async (orderId) => {
    try {
      await confirmDelivery(orderId);
      setModalOpen(false);
      setSelectedOrder(null);
      await loadOrders();
    } catch (error) {
      alert('❌ Failed to confirm delivery');
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">Today's Deliveries</h1>

      {/* Summary Card */}
      {!loading && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="py-2 px-4">
            <CardHeader className="p-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                📦 Regular Tiffins
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-600 p-2">
              {totalTiffins}
            </CardContent>
          </Card>

          <Card className="py-2 px-4">
            <CardHeader className="p-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                🌟 Special Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-yellow-600 p-2">
              {specialCount}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Orders */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found for today.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order, idx) => (
            <Dialog
              key={idx}
              open={modalOpen && selectedOrder?._id === order._id}
              onOpenChange={(open) => {
                setModalOpen(open);
                if (!open) setSelectedOrder(null);
              }}
            >
              <DialogTrigger asChild>
                <Card
                  onClick={() => {
                    setSelectedOrder(order);
                    setModalOpen(true);
                  }}
                  className={`cursor-pointer transition hover:shadow-md hover:scale-[1.01] border border-gray-200 hover:border-gray-300 ${
                    order.status === 'delivered' ? 'border-green-900 border-2 bg-green-100' : ''
                  }`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold truncate">
                      {order.comments[0]?.comment}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-gray-700">
                    <p><span className="font-medium">📞</span> {order.customerPrimaryPhoneNumber}</p>
                    <p className="hover:text-blue-600 underline">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress?.addressInfo || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📍 {order.deliveryAddress?.addressInfo || 'No address'}
                      </a>
                    </p>
                    <p>🍱 Qty: {order.items?.tiffin}</p>
                    {order.specialItems?.length > 0 && (
                      <p className="text-blue-500">✨ {order.specialItems.join(', ')}</p>
                    )}
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{order.comments[0]?.comment}</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-sm text-gray-800 mt-2">
                  <p><strong>Address:</strong> {order.deliveryAddress?.addressInfo}</p>
                  <p><strong>Phone:</strong> {order.customerPrimaryPhoneNumber}</p>
                  <p><strong>Delivery Notes:</strong> {order.deliveryAddress.deliveryType || 'N/A'}</p>
                  <p><strong>Stop #:</strong> {order.stopNumber}</p>
                  <p><strong>Tiffin Qty:</strong> {order.items?.tiffin}</p>
                  {order.specialItems?.length > 0 && (
                    <p><strong>Special Items:</strong> {order.specialItems.join(', ')}</p>
                  )}
                  <div className="flex flex-col gap-2 mt-4">
                    <Button variant="default" onClick={() => window.open(`tel:${order.customerPrimaryPhoneNumber}`)}>📞 Call</Button>
                    <Button variant="secondary" onClick={() => window.open(`sms:${order.customerPrimaryPhoneNumber}`)}>💬 Text</Button>
                    <Button variant="outline" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress?.addressInfo || '')}`, '_blank')}>📍 View Map</Button>
                    <Button variant="secondary" onClick={() => handleDelivery(order._id)}>✅ Completed</Button>
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
