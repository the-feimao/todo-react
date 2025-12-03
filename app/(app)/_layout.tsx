import React, { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { useAuth } from '../../lib/auth';

export default function AppLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // wait
    if (!user) {
      // send to onboarding first
      router.replace('/(onboard)');
    } else {
      // stay in app
    }
  }, [user, loading]);

  // while redirecting, render nothing
  if (loading || !user) return null;

  return <Slot />;
}
