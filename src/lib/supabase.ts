import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://zilnpzbfpsfclpnmqdxn.supabase.co';
const DEFAULT_KEY = 'sb_publishable_Ak2nqvAxmPhn_ywuVrsfpw_Z3OKoNcn';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_KEY;

if (supabaseUrl === DEFAULT_URL || supabaseAnonKey === DEFAULT_KEY) {
  console.info('Using default Supabase credentials. You can override these in settings.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface SupabaseErrorInfo {
  error: string;
  operationType: OperationType;
  table: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

export function handleSupabaseError(error: { message?: string } | null, operationType: OperationType, table: string | null) {
  if (!error) return;

  const errInfo: SupabaseErrorInfo = {
    error: error.message || String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    table
  };

  // Supplement auth info asynchronously if needed, but for now we log and throw
  console.error('Supabase Error: ', JSON.stringify(errInfo));
  throw new Error(errInfo.error);
}

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) {
    if (error.message.includes('provider is not enabled')) {
      console.error('AUTH CONFIG ERROR: Google provider is not enabled in Supabase Dashboard (Authentication > Providers).');
    }
    throw error;
  }
  return data;
};

export const logout = () => supabase.auth.signOut();
