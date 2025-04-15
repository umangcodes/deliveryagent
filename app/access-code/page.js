"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { verifyAccessCode } from '../../lib/api/auth';

export default function AccessCodePage() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const data = await verifyAccessCode(accessCode);
      Cookies.set('accessCode', accessCode, { expires: 1 });
      Cookies.set('areaCode', data.areaCode, { expires: 1 });
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Enter Access Code</h1>
      <input
        type="text"
        value={accessCode}
        onChange={e => setAccessCode(e.target.value)}
        placeholder="SC-0414"
        className="border p-2 rounded w-full max-w-sm"
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}
