
-- This is a migration file to apply proper RLS policies for the deals table
-- This will be applied automatically if you run this migration

-- First, let's ensure RLS is enabled on the deals table
ALTER TABLE IF EXISTS public.deals ENABLE ROW LEVEL SECURITY;

-- Let's create a default policy that allows all operations (for now)
-- In a production environment, you would want to restrict this based on user ownership
DROP POLICY IF EXISTS "Enable all access to deals" ON public.deals;
CREATE POLICY "Enable all access to deals" ON public.deals
    USING (true)
    WITH CHECK (true);

-- Do the same for contacts table to ensure contacts can be accessed
ALTER TABLE IF EXISTS public.contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access to contacts" ON public.contacts;
CREATE POLICY "Enable all access to contacts" ON public.contacts
    USING (true)
    WITH CHECK (true);

-- Do the same for leads table to ensure leads can be accessed
ALTER TABLE IF EXISTS public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access to leads" ON public.leads;
CREATE POLICY "Enable all access to leads" ON public.leads
    USING (true)
    WITH CHECK (true);
