
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create payslips table
CREATE TABLE public.payslips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  basic NUMERIC NOT NULL DEFAULT 0,
  hra NUMERIC NOT NULL DEFAULT 0,
  special_allowance NUMERIC NOT NULL DEFAULT 0,
  other_allowance NUMERIC NOT NULL DEFAULT 0,
  employee_pf NUMERIC NOT NULL DEFAULT 0,
  employer_pf NUMERIC NOT NULL DEFAULT 0,
  professional_tax NUMERIC NOT NULL DEFAULT 0,
  income_tax NUMERIC NOT NULL DEFAULT 0,
  gross_salary NUMERIC NOT NULL DEFAULT 0,
  deductions NUMERIC NOT NULL DEFAULT 0,
  in_hand_salary NUMERIC NOT NULL DEFAULT 0,
  ctc NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_history table
CREATE TABLE public.chat_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payslip_id UUID REFERENCES public.payslips(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE USING (auth.uid() = user_id);

-- Payslips policies
CREATE POLICY "Users can view own payslips" ON public.payslips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own payslips" ON public.payslips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own payslips" ON public.payslips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own payslips" ON public.payslips FOR DELETE USING (auth.uid() = user_id);

-- Chat history policies
CREATE POLICY "Users can view own chats" ON public.chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own chats" ON public.chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own chats" ON public.chat_history FOR DELETE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
