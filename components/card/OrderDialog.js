'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Phone,
  MessageCircle,
  Navigation,
  Package,
  Camera,
  Eye,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { confirmDeliveryWithProof, fetchSignedUrl } from '@/lib/api/orders';

export default function OrderDialog({ order, children, handleStatusUpdate }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [proofUrl, setProofUrl] = useState(null);
  const fileInputRef = useRef(null);

  const getCustomerName = () =>
    order.comments?.[0]?.comment?.split(' ')[0] || 'Customer';

  const getAddress = () =>
    order.deliveryAddress?.addressInfo || 'N/A';

  const handleDelivered = async () => {
    await handleStatusUpdate(order._id);
    setOpen(false);
  };

  const handleUploadProof = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await confirmDeliveryWithProof(order._id, file);
      setProofUploaded(true);
      await handleStatusUpdate(order._id);
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert('❌ Upload or delivery confirmation failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleViewProof = async () => {
    try {
      const signed = await fetchSignedUrl(order.delivery.proof.gcsUrl);
      setProofUrl(signed);
      setImageModalOpen(true);
    } catch (err) {
      console.error(err);
      alert('❌ Could not fetch proof image');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl px-5 py-6">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <Package className="h-6 w-6 text-primary" />
              Order #{order.stopNumber} - {getCustomerName()}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4 text-sm">
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-lg">
                <div className="flex gap-2">
                  <span className="text-gray-500 font-medium">📞 </span>
                  <span className="font-semibold">{order.customerPrimaryPhoneNumber}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 font-medium">🚚 </span>
                  <span className="capitalize">
                    {order.deliveryAddress?.deliveryType || 'N/A'}
                  </span>
                </div>
                <div className="flex col-span-full">
                  <span className="text-gray-500 font-medium">📍 </span>
                  <span className="font-medium">{getAddress()}</span>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-gray-100 rounded-xl p-2 px-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-800">🥡 Tiffin Qty</h3>
                <span className="text-2xl font-bold text-green-700 px-4">
                  {order.items?.tiffin || 0}
                </span>
              </div>

              {order.specialItems?.length > 0 && (
                <div className="pt-3">
                  <p className="text-base font-semibold text-yellow-700 mb-1">
                    ✨ Special Items
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {order.specialItems.map((item, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs px-3 py-1 rounded-full"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Special Instructions */}
            {order.comments?.[0]?.comment && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                <h3 className="font-semibold text-blue-900 mb-1 text-sm">
                  📘 Special Notes
                </h3>
                <p className="text-blue-800 text-sm pl-4">
                  {order.deliveryAddress.deliveryType}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-4">
              <Button
                className="h-16 w-full flex items-center justify-center rounded-xl shadow-md hover:scale-105 transition"
                variant="default"
                onClick={() =>
                  window.open(`tel:${order.customerPrimaryPhoneNumber}`)
                }
                aria-label="Call Customer"
              >
                <Phone className="h-6 w-6" />
                <p className="text-sm">Call</p>
              </Button>

              <Button
                className="h-16 w-full flex items-center justify-center rounded-xl shadow-md hover:scale-105 transition"
                variant="secondary"
                onClick={() =>
                  window.open(`sms:${order.customerPrimaryPhoneNumber}`)
                }
                aria-label="Send SMS"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>

              <Button
                className="h-16 w-full flex items-center justify-center rounded-xl shadow-md hover:scale-105 transition"
                variant="outline"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      order.deliveryAddress?.addressInfo || ''
                    )}`,
                    '_blank'
                  )
                }
                aria-label="Open in Maps"
              >
                <Navigation className="h-6 w-6" />
              </Button>

              <Button
                className="h-16 col-span-2 bg-green-100 border border-green-400 text-green-800 flex items-center justify-center rounded-xl shadow-md hover:scale-105 transition"
                onClick={handleDelivered}
                aria-label="Mark as Delivered"
              >
                ✅ Delivered
              </Button>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  className={`h-16 w-full flex items-center justify-center rounded-xl shadow-md hover:scale-105 transition ${
                    proofUploaded || order.delivery?.proof?.gcsUrl
                      ? 'bg-green-100 border border-green-500 text-green-700'
                      : 'border-blue-600 text-blue-700 hover:bg-blue-50'
                  }`}
                  variant="outline"
                  onClick={handleUploadProof}
                  disabled={uploading}
                  aria-label="Upload Photo"
                >
                  {uploading ? (
                    <span className="text-sm">Uploading...</span>
                  ) : proofUploaded || order.delivery?.proof?.gcsUrl ? (
                    <span className="text-sm">📷 Replace Photo</span>
                  ) : (
                    <>
                      <Camera className="h-6 w-6 mr-1" />
                      <span className="text-sm">Upload</span>
                    </>
                  )}
                </Button>
              </div>

              {/* View Proof Button */}
              {order.delivery?.proof?.gcsUrl && (
                <Button
                  variant="outline"
                  onClick={handleViewProof}
                  className="col-span-3 bg-yellow-100 text-yellow-800 border-yellow-400 hover:bg-yellow-200"
                >
                  <Eye className="h-5 w-5 mr-1" />
                  View Proof
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Proof Image Modal */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Delivery Proof</DialogTitle>
          </DialogHeader>
          {proofUrl ? (
            <img
              src={proofUrl}
              alt="Delivery Proof"
              className="rounded-lg border max-h-[500px] mx-auto"
            />
          ) : (
            <p className="text-center text-sm text-gray-500">Loading image...</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
