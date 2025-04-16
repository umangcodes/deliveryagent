'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { fetchAllAreas } from '../../lib/api/area';
import { fetchOrdersByArea } from '../../lib/api/orders';
import { verifyAccessCode } from '../../lib/api/auth';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

export default function ManagePage() {
  const router = useRouter();
  const [areas, setAreas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({
    areaCode: '',
    tiffins: 0,
    specials: 0,
  });

  // 🔐 Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const accessCode = Cookies.get('accessCode');
      const areaCode = Cookies.get('areaCode');

      if (areaCode !== 'MANAGEMENT' || !accessCode) {
        router.push('/access-code');
        return;
      }

      try {
        const res = await verifyAccessCode(accessCode);
        if (res.areaCode !== areaCode) throw new Error();
      } catch {
        Cookies.remove('accessCode');
        Cookies.remove('areaCode');
        router.push('/access-code');
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const loadAreas = async () => {
      const areaData = await fetchAllAreas();
      setAreas(areaData);
    };
    loadAreas();
  }, []);

  const handleAreaClick = async (areaCode) => {
    setOpenModal(true);
    try {
      const orders = await fetchOrdersByArea(areaCode);
      const tiffinCount = orders.reduce((acc, o) => acc + (o.items?.tiffin || 0), 0);
      const specialCount = orders.filter(o => o.specialItems?.length > 0).length;
      setModalData({ areaCode, tiffins: tiffinCount, specials: specialCount });
    } catch {
      setModalData({ areaCode, tiffins: 0, specials: 0 });
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">📍 Area Summary Dashboard</h1>

      {/* Responsive grid of area cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {areas.map((area, idx) => (
          <div
            key={idx}
            onClick={() => handleAreaClick(area.areaCode)}
            className="cursor-pointer w-full h-full p-4 border rounded-xl shadow-sm bg-white hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold text-gray-800">{area.shortForm}</p>
              <p className="text-xs text-gray-500">{area.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for summary */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="text-center max-w-sm mx-auto bg-white border border-gray-200 shadow-lg rounded-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              📦 Orders in <span className="text-blue-600">{modalData.areaCode}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-5 text-base space-y-3">
            <div className="flex justify-between px-4 text-left">
              <span>🍱 Regular Tiffins:</span>
              <span className="font-bold text-green-600">{modalData.tiffins}</span>
            </div>
            <div className="flex justify-between px-4 text-left">
              <span>✨ Special Orders:</span>
              <span className="font-bold text-yellow-500">{modalData.specials}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
