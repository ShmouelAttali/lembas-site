// src/app/admin/page.tsx
import AdminPageClient from './AdminPageClient'
import {supabaseServer} from '@/lib/supabase-server'
import {redirect} from 'next/navigation';

async function fetchTableData(table: string) {
    const supabase = await supabaseServer();
    const {data, error} = await supabase.from(table).select('*')
    if (error) throw new Error(error.message)
    return data
}


async function requireAdmin() {
    const supabase = await supabaseServer();
    const {data: {session}} = await supabase.auth.getSession();
    const user = session?.user;
    console.log('user', user)
    // your logic: check role claim or email
    if (!user || user.app_metadata.role !== 'admin') {
        redirect('/login');
    }
    return user;
}

export default async function AdminPage({
                                            searchParams,             // ← will be supplied by Next
                                        }: {
    searchParams: { tab?: string }
}) {
    await requireAdmin();
    const curSearchParams = await searchParams;
    const activeTab = curSearchParams.tab ?? 'products'
    const initialData =
        activeTab === 'orders_summary'
            ? [] // ← Don't fetch server-side; let client do it
            : await fetchTableData(activeTab);

    return (
        <AdminPageClient
            initialData={initialData}
            activeTab={activeTab}
        />
    )
}
