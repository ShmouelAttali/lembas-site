import CheckoutPageClient from "@/app/checkout/CheckoutPageClient";
import {addDays} from "@/lib/utils"
import {supabaseServer} from "@/lib/supabase-server";

export default async function CheckoutPage() {
    const tomorrow = addDays(new Date(), 1).toISOString().slice(0, 10);
    const supabase = await supabaseServer();
    const {data: datesStr} = await supabase.from('order_dates').select('date').gt('date', tomorrow).limit(3).order('date');
    const dates = datesStr?.map(d => new Date(d.date)) ?? [];
    return <CheckoutPageClient dates={dates}/>
}
