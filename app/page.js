"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const accessCode = Cookies.get('accessCode');
    if (accessCode) {
      router.replace('/dashboard');
    } else {
      router.replace('/access-code');
    }
  }, []);

  return null;
}
