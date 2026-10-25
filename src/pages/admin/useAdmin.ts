import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AdminState = { status: 'loading' } | { status: 'signed-out' } | { status: 'not-admin'; user: User } | { status: 'admin'; user: User };

export function useAdmin(): AdminState {
  const [state, setState] = useState<AdminState>({ status: 'loading' });
  useEffect(() => {
    let active = true;
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      if (!user) return setState({ status: 'signed-out' });
      const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
      if (active) setState(data ? { status: 'admin', user } : { status: 'not-admin', user });
    };
    const { data: sub } = supabase.auth.onAuthStateChange(() => { setTimeout(check, 0); });
    check();
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);
  return state;
}
