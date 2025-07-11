'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import OrderCard from './OrderCard';
import {
  Phone,
  MessageCircle,
  Navigation,
  Package,
  AlertCircle,
  Camera,
  Clock,
  MapPin
} from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';

export default function OrderDialog({ order, children, handleStatusUpdate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl px-5 py-6">
      <DialogHeader className="text-left space-y-2">
        <DialogTitle asChild>
            <div className="flex items-center gap-3 text-xl font-semibold text-gray-900">
            <Package className="h-7 w-7 text-primary" />
            <span>
                Order for{" "}
                <span className="font-bold">
                {order.comments?.[0]?.comment?.split(" ")[0] || "Customer"} - {order.stopNumber}
                </span>
            </span>
            </div>
        </DialogTitle>
        </DialogHeader>




        <div className="space-y-6 mt-4">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className='flex gap-5'>
                <span className="text-gray-600">Contact:</span>
                <p className="font-medium">{order.customerPrimaryPhoneNumber}</p>
              </div>
              <div className='flex gap-5'>
                <span className="text-gray-600">Delivery Type:</span>
                <p className="font-medium capitalize">{order.deliveryAddress?.deliveryType || 'N/A'}</p>
              </div>
              <div className='flex gap-5'>
                <span className="text-gray-600">Address:</span>
                <p className="font-medium">{order.deliveryAddress?.addressInfo.slice(0, 33) + '...' || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-gray-100 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">🥡 Tiffin Quantity</h3>
                <span className="text-2xl font-bold text-green-700">
                {order.items?.tiffin || 0}
                </span>
            </div>

            {order.specialItems?.length > 0 && (
                <div className="border-t pt-3">
                <p className="text-base font-semibold text-yellow-700 mb-2">
                    ✨ Special Items Included
                </p>
                <div className="flex flex-wrap gap-2">
                    {order.specialItems.map((item, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm px-3 py-1 rounded-full">
                        {item}
                    </Badge>
                    ))}
                </div>
                </div>
            )}
            </div>



          {/* Special Instructions */}
          {order.comments?.[0]?.comment && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Special Instructions</h3>
              <p className="text-blue-800">{order.deliveryAddress.deliveryType}</p>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4 pt-6">
                <Button
                    className="h-16 w-full flex items-center justify-center rounded-xl shadow-md hover:scale-105 transition"
                    variant="default"
                    onClick={() => window.open(`tel:${order.customerPrimaryPhoneNumber}`)}
                >
                    <Phone className="h-6 w-6" />
                </Button>

                <Button
                    className="h-16 w-full flex items-center justify-center rounded-xl shadow-md hover:scale-105 transition"
                    variant="secondary"
                    onClick={() => window.open(`sms:${order.customerPrimaryPhoneNumber}`)}
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>

                <Button
                    className="h-16 w-full flex items-center justify-center rounded-xl shadow-md hover:scale-105 transition"
                    variant="outline"
                    onClick={() =>
                    window.open(
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress?.addressInfo || '')}`,
                        '_blank'
                    )
                    }
                >
                    <Navigation className="h-6 w-6" />
                </Button>

                <Button
                    className="h-16 w-full flex items-center bg-green-200 justify-center rounded-xl shadow-md hover:scale-105 transition col-span-2"
                    variant="outline"
                    onClick={() => handleStatusUpdate(order._id)}
                >
                    ✅
                </Button>

                <Button
                    className="h-16 w-full flex items-center justify-center rounded-xl border-blue-600 text-blue-700 hover:bg-blue-50 shadow-md hover:scale-105 transition"
                    variant="outline"
                    onClick={() => console.log('Upload proof clicked for order:', order._id)}
                >
                    <Camera className="h-6 w-6" />
                </Button>
                </div>



        </div>
      </DialogContent>
    </Dialog>
  );
}
