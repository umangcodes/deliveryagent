import { Card } from '@/components/ui/card';

export default function OrderCard({ order, onClick }) {
  return (
    <Card
      onClick={onClick}
      className={`rounded-2xl shadow-md px-5 py-4 space-y-3 border-2 transition-all duration-150 cursor-pointer ${
        order.status === 'delivered'
          ? 'border-green-700 bg-green-100'
          : 'border-gray-300 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-lg sm:text-xl font-bold text-gray-900 truncate">
          {order.comments?.[0]?.comment || 'No comment'}
        </div>
        <span
          className={`text-sm px-3 py-1 rounded-full font-medium ${
            order.status === 'delivered'
              ? 'bg-green-700 text-white'
              : 'bg-yellow-400 text-black'
          }`}
        >
          {order.status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-1 text-base text-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-lg">📞</span>
          <span className="font-medium">{order.customerPrimaryPhoneNumber}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-lg mt-0.5">📍</span>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress?.addressInfo || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline font-medium"
          >
            {order.deliveryAddress?.addressInfo || 'No address'}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🍱</span>
          <span className="font-semibold">Tiffin Qty: {order.items?.tiffin || 0}</span>
        </div>
        {order.specialItems?.length > 0 && (
          <div className="text-blue-700 font-medium">
            ✨ {order.specialItems.join(', ')}
          </div>
        )}
      </div>
    </Card>
  );
}
