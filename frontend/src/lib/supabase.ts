'use client';

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY} from '../config';

// Environment değişkenleri yoksa varsayılan değerleri kullan
const supabaseUrl = SUPABASE_URL
const supabaseKey = SUPABASE_ANON_KEY

// Supabase client'ı oluştur
export const supabase = createClient(supabaseUrl, supabaseKey);