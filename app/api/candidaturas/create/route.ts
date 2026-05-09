import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const { name, email, phone, area } = await request.json();

    if (!name || !email || !phone || !area) {
      return NextResponse.json(
        { error: 'Nome, email, telefone e área são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Validar telefone
    const phoneRegex = /^[0-9()+\s-]{8,20}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Telefone inválido' },
        { status: 400 }
      );
    }

    // Initialize Supabase with service role key if available to bypass RLS, and correct schema
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: 'site' }
    });

    console.log('[CANDIDATURAS] Iniciando criação:', { name, email, phone, area });

    // Inserir candidatura
    const { data, error } = await supabase
      .from('candidaturas')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          area: area,
          created_at: new Date().toISOString(),
          status: 'pending'
        }
      ])
      .select();

    if (error) {
      console.error('[CANDIDATURAS] Erro do Supabase:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar candidatura' },
        { status: 500 }
      );
    }

    console.log('[CANDIDATURAS] Candidatura criada com sucesso:', data[0].id);
    return NextResponse.json({
      success: true,
      message: 'Candidatura enviada com sucesso!',
      data: data[0]
    }, { status: 201 });

  } catch (err) {
    console.error('[CANDIDATURAS] Erro interno:', err);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}