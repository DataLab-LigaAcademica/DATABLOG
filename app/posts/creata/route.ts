import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const { title, content, status, image_url } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título e conteúdo são obrigatórios' },
        { status: 400 }
      );
    }

    // Initialize Supabase with service role key if available to bypass RLS, and correct schema
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: 'site' }
    });

    console.log('[POSTS] Iniciando criação:', { title, status: status || 'draft' });

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const finalSlug = `${slug}-${Math.floor(Math.random() * 10000)}`;

    // Try to identify the author
    const authHeader = request.headers.get('Authorization');
    console.log('[POSTS] Authorization Header presente:', !!authHeader);
    
    let authorId = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (user) {
        authorId = user.id;
        console.log('[POSTS] Autor identificado via JWT:', authorId);
        
        // Garante que o autor existe na tabela site.authors para evitar erro de FK
        console.log('[POSTS] Sincronizando autor em site.authors...');
        const { data: syncData, error: upsertError } = await supabase
          .from('authors')
          .upsert({ 
            user_id: user.id, 
            name: user.email?.split('@')[0] || 'Admin',
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' })
          .select();
          
        if (upsertError) {
          console.error('[POSTS] ERRO CRÍTICO ao sincronizar autor:', upsertError.message);
          return NextResponse.json(
            { error: `Erro ao registrar autor no banco: ${upsertError.message}. Verifique se a tabela site.authors existe e se o RLS permite a inserção.` },
            { status: 500 }
          );
        } else {
          console.log('[POSTS] Autor sincronizado com sucesso:', syncData);
        }
      } else {
        console.log('[POSTS] Erro ao validar token JWT:', authError?.message);
      }
    }

    // Fallback: If still no authorId, try to get the first one from authors table for demo
    if (!authorId) {
      console.log('[POSTS] Tentando fallback para o primeiro autor da tabela site.authors...');
      const { data: authors, error: authorsError } = await supabase.from('authors').select('user_id').limit(1);
      
      if (authorsError) {
        console.error('[POSTS] Erro ao buscar autores do DB:', authorsError.message);
      }

      if (authors && authors.length > 0) {
        authorId = authors[0].user_id;
        console.log('[POSTS] Autor identificado via Fallback (DB):', authorId);
      }
    }

    if (!authorId) {
      console.error('[POSTS] FALHA CRÍTICA: Nenhum autor identificado.');
      // Como estamos em integração, se tudo falhar, vamos usar um ID temporário apenas para permitir o teste
      // REMOVA ISSO EM PRODUÇÃO
      authorId = '00000000-0000-0000-0000-000000000000'; 
      console.log('[POSTS] Usando ID de emergência para teste.');
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        { 
          title, 
          slug: finalSlug,
          content, 
          image_url,
          published: status === 'published',
          author_id: authorId,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('[POSTS] Erro ao criar post:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, post: data[0] }, { status: 201 });
  } catch (err) {
    console.error('[POSTS] Erro interno:', err);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
