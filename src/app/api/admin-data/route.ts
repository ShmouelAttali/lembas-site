// src/app/api/admin-data/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const table = url.searchParams.get('table') ?? 'products'

    const supabase = await supabaseServer()
    const { data, error } = await supabase
        .from(table)
        .select('*')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
}
