'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/guard/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { FaBox, FaBoxes } from 'react-icons/fa';

export default function DispatchSummaryPage() {
  const [onDuty, setOnDuty] = useState(false);
  const router = useRouter();

  const handleToggle = () => {
    setOnDuty((prev) => !prev);
    if (!onDuty) router.push('/delivery-dashboard');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center px-6 py-10">
        <Card className="w-full max-w-md shadow-lg rounded-lg bg-white">
          <CardHeader className="bg-blue-600 text-white p-4 rounded-t-lg">
            <CardTitle className="text-center text-xl font-semibold">
              Dispatch Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Package Summary */}
            <div className="flex flex-col items-center space-y-4 md:space-y-0 md:flex-row md:justify-around">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                  <FaBox className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Regular Packages</p>
                  <p className="text-lg font-bold text-gray-800">15</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                  <FaBoxes className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Special Packages</p>
                  <p className="text-lg font-bold text-gray-800">5</p>
                </div>
              </div>
            </div>

            {/* Duty Toggle */}
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
              <span className="text-gray-700 font-medium">Duty Status</span>
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${onDuty ? 'text-gray-400' : 'text-red-500'}`}>
                  Off Duty
                </span>
                <Switch checked={onDuty} onCheckedChange={handleToggle} />
                <span className={`text-sm ${onDuty ? 'text-green-600' : 'text-gray-400'}`}>
                  On Duty
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
