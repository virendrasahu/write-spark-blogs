// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sznrxbtiqcyudsjzcnqm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bnJ4YnRpcWN5dWRzanpjbnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MDAxNDMsImV4cCI6MjA2ODE3NjE0M30.0Iz-NyfvV-4DdoJjMQKXzKAKpW2MsjII7mQ3ubvHuh0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});