import {NextResponse} from 'next/server'
import {supabaseServer} from '@/lib/supabase-server'
import {requireAdmin} from '@/lib/api-auth'

// Tables the admin tools may read through this route.
const ALLOWED_TABLES = new Set([
    'products',
    'categories',
    'order_dates',
    'orders',
    'order_items',
    'ingredients',
    'product_ingredients',
    'ingredients_inventory',
])

export async function GET(request: Request) {
    const url = new URL(request.url)
    const table = url.searchParams.get('table') ?? 'products'

    const supabase = await supabaseServer()
    const denied = await requireAdmin(supabase)
    if (denied) return denied

    if (!ALLOWED_TABLES.has(table)) {
        return NextResponse.json({error: 'Unknown table'}, {status: 400})
    }

    const {data, error} = await supabase
        .from(table)
        .select('*')

    if (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
    return NextResponse.json(data)
}
