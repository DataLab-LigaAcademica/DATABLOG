import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function PUT(request: Request) {
  try {
    const { id, title, content, status, image_url } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'O ID do post é obrigatório' },
        { status: 400 }
      );
    }

    // Initialize Supabase with service role key if available to bypass RLS, and correct schema
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: 'site' }
    });

    console.log('[POSTS] Iniciando atualização:', { id, title, status: status || 'draft' });

    // Try to identify the author (for security check if needed)
    const authHeader = request.headers.get('Authorization');
    let userId = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) userId = user.id;
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (title) {
      updateData.title = title;
      // Update slug only if title changes? Maybe better to keep it stable
    }
    
    if (content) updateData.content = content;
    if (status !== undefined) updateData.published = status === 'published';
    if (image_url !== undefined) updateData.image_url = image_url;

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('[POSTS] Erro ao atualizar post:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post: data[0] });
  } catch (err) {
    console.error('[POSTS] Erro interno:', err);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
