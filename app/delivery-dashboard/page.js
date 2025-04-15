'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/guard/ProtectedRoute';
import DeliveryCard from '@/components/card/DeliveryCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function DeliveryDashboardPage() {
  const [onDuty, setOnDuty] = useState(true);
  const remaining = 15;
  const delivered = 10;

  const handleOffDuty = () => setOnDuty(false);
  const handleOnDuty = () => setOnDuty(true);

  return (
    <ProtectedRoute>
      <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Delivery Dashboard</h1>
          {onDuty ? (
            <Button variant="destructive" onClick={handleOffDuty}>
              Off Duty
            </Button>
          ) : (
            <Button variant="primary" onClick={handleOnDuty}>
              Go On Duty
            </Button>
          )}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Package Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-center">
            <div>
                <Label>Remaining</Label>
                <div className="bg-blue-100 p-4 rounded-lg shadow-sm flex justify-around">
                    <div className='flex flex-col'>
                        <p className="font-bold text-blue-600">Regular</p>
                        <p className="text-2xl font-bold text-blue-600">{remaining}</p>
                    </div>
                    <div className='flex flex-col'>
                        <p className="font-bold text-blue-600">Special</p>
                        <p className="text-2xl font-bold text-blue-600">{remaining}</p>
                    </div>
                </div>
            </div>
            <div>
                <Label>Delivered</Label>
                <div className="bg-green-100 p-4 rounded-lg shadow-sm flex justify-around">
                    <div className='flex flex-col'>
                        <p className="font-bold text-blue-600">Regular</p>
                        <p className="text-2xl font-bold text-blue-600">{remaining}</p>
                    </div>
                    <div className='flex flex-col'>
                        <p className="font-bold text-blue-600">Special</p>
                        <p className="text-2xl font-bold text-blue-600">{remaining}</p>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        {onDuty ? (
          <div className="space-y-4">
            <DeliveryCard id={1} address="123 Main St" />
            <DeliveryCard id={2} address="456 Elm St" />
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">You are off duty.</p>
            <p className="text-sm text-gray-400">Switch back on duty to see your delivery tasks.</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
