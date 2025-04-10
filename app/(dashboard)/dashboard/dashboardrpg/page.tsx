import { db } from '@/lib/db/drizzle'
import { userPurchasesTable } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { desc } from 'drizzle-orm';

export default async function purchaselist() {

    const allPurchases = await db
        .select()
        .from(userPurchasesTable)
        .orderBy(desc(userPurchasesTable.purchaseDate));


    // <section className="flex-1 p-4 lg:p-8">
    //   <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
    //     RPG Dashboard
    //   </h1>
    // </section>        

    return (
        <div>
            <main>
                <h1 className="mb-4 text-xl md">
                    Dashboard
                </h1>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    <Card title="Collected"  type="collected" />
                    <Card title="Pending"  type="pending" />
                    <Card title="Total Invoices"  type="invoices" />
                    <Card title="Total Customers" type="customers" /> 

                </div>
            </main>
        </div>
    )
}   