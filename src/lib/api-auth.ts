import {NextResponse} from 'next/server';
import {supabaseServer} from '@/lib/supabase-server';

type ServerClient = Awaited<ReturnType<typeof supabaseServer>>;

/**
 * Allows only a logged-in user whose app_metadata.role is 'admin'
 * (same rule the /data page and the nav use). Returns a response to send
 * when access is denied, or null when the caller is an admin.
 */
export async function requireAdmin(supabase: ServerClient): Promise<NextResponse | null> {
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    if (user.app_metadata?.role !== 'admin') {
        return NextResponse.json({error: 'Forbidden'}, {status: 403});
    }
    return null;
}
