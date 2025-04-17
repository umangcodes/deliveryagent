'use client';
import { useState } from 'react';
import { punchIn } from '../../lib/api/punch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function PunchPage() {
  const [driverName, setDriverName] = useState('');
  const [punchStatus, setPunchStatus] = useState({
    arrived: null,
    dispatched: null,
  });
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const handlePunch = async (type) => {
    if (!driverName.trim()) {
      setError('Please enter your name.');
      return;
    }

    setLoading(type);
    setError('');
    setWarning('');
    try {
      const res = await punchIn(driverName, type );

      if (res.warning) {
        setWarning(res.warning);
        setPunchStatus((prev) => ({
          ...prev,
          [type]: new Date(res.timestamp).toLocaleTimeString(),
        }));
      } else {
        setPunchStatus((prev) => ({
          ...prev,
          [type]: new Date(res.timestamp).toLocaleTimeString(),
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto text-center bg-white rounded-md shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-4">🚛 Driver Punch Portal</h1>
      <p className="text-sm text-gray-500 mb-6">Please punch in when you arrive and again before starting dispatch.</p>

      {!punchStatus.arrived && !punchStatus.dispatched && (
        <div className="mb-6">
          <Label htmlFor="driver-name" className="block text-sm font-medium mb-2 text-left">
            Agent Name
          </Label>
          <Input
            id="driver-name"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            placeholder="Enter your name"
            className="w-full"
          />
        </div>
      )}

      {driverName && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            👋 Welcome, <span className="text-blue-600">{driverName}</span>
          </h2>
        </div>
      )}

      <div className="grid gap-5">
        {/* Punch In */}
        <div className="text-left">
          <p className="text-sm font-medium text-gray-600 mb-2">🚶‍♂️ Arrived at Location</p>
          <Button
            onClick={() => handlePunch('arrived')}
            disabled={!driverName.trim() || !!punchStatus.arrived || loading === 'arrived'}
            className="w-full flex justify-center items-center gap-2"
            variant={punchStatus.arrived ? 'outline' : 'default'}
          >
            {punchStatus.arrived ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Punched at {punchStatus.arrived}
              </>
            ) : loading === 'arrived' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Punching...
              </>
            ) : (
              'Punch In'
            )}
          </Button>
        </div>

        {/* Dispatch Start */}
        <div className="text-left">
          <p className="text-sm font-medium text-gray-600 mb-2">🚚 Starting Dispatch</p>
          <Button
            onClick={() => handlePunch('dispatched')}
            disabled={!driverName.trim() || !!punchStatus.dispatched || loading === 'dispatched'}
            className="w-full flex justify-center items-center gap-2"
            variant={punchStatus.dispatched ? 'outline' : 'default'}
          >
            {punchStatus.dispatched ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Punched at {punchStatus.dispatched}
              </>
            ) : loading === 'dispatched' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Punching...
              </>
            ) : (
              'Start Dispatch'
            )}
          </Button>
        </div>
      </div>

      {warning && (
        <p className="text-yellow-500 mt-4 text-sm">{warning}</p>
      )}
      {error && (
        <p className="text-red-500 mt-4 text-sm">{error}</p>
      )}
    </div>
  );
}
