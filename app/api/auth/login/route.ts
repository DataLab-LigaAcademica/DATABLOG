import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`[AUTH] Erro do Supabase: ${error.message}`);
      console.log(`[AUTH] Falha no login: ${email} - Status: ${error.status || 401}`);
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 401 }
      );
    }

    console.log(`[AUTH] Login bem-sucedido: ${email} - Status: 200`);
    return NextResponse.json({ success: true, session: data.session, user: data.user }, { status: 200 });
  } catch (err) {
    console.error(`[AUTH] Erro interno:`, err);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
