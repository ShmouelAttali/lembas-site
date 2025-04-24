// src/app/admin/page.tsx
import AdminPageClient from './AdminPageClient'
import { supabaseServer } from '@/lib/supabase-server'

async function fetchTableData(table: string) {
    const supabase = await supabaseServer()
    const { data, error } = await supabase.from(table).select('*')
    if (error) throw new Error(error.message)
    return data
}

export default async function AdminPage({
                                            searchParams,             // ← will be supplied by Next
                                        }: {
    searchParams: { tab?: string }
}) {
    const curSearchParams = await searchParams;
    const activeTab = curSearchParams.tab ?? 'products'
    const initialData = await fetchTableData(activeTab)

    return (
        <AdminPageClient
            initialData={initialData}
            activeTab={activeTab}
        />
    )
}
