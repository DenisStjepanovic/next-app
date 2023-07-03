import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://izmfvxkshguouykyxekc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6bWZ2eGtzaGd1b3V5a3l4ZWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODczNjY0MjYsImV4cCI6MjAwMjk0MjQyNn0.kFOirTsGin33e5ZzTxvC2DvIh_N61qH_HNgrtWTxOJY')

export default supabase