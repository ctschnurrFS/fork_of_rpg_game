import { db } from '@/lib/db/drizzle'
import { userPurchasesTable } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { desc } from 'drizzle-orm';

export default async function purchaselist() {

    //const allPurchases = await db.select().from(userPurchasesTable);

    const allPurchases = await db
      .select()
      .from(userPurchasesTable)
      .orderBy(desc(userPurchasesTable.purchaseDate));    

    return (

        <section className="flex-1 p-4 lg:p-8">
            <Card className="mb-8">

                <CardHeader>
                    <CardTitle>User Purchases</CardTitle>
                </CardHeader>
                <CardContent>

                    <div className="p-4">
                        <div className="overflow-x-auto"> {/* Add horizontal scrolling if needed */}
                            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-2 px-4 text-left font-semibold text-gray-700">User Name</th>
                                        <th className="py-2 px-4 text-left font-semibold text-gray-700">Item Name</th>
                                        <th className="py-2 px-4 text-left font-semibold text-gray-700">Price</th>
                                        <th className="py-2 px-4 text-left font-semibold text-gray-700">Quantity</th>
                                        <th className="py-2 px-4 text-left font-semibold text-gray-700">Purchase Date</th>
                                        <th className="py-2 px-4 text-left font-semibold text-gray-700">Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allPurchases.map((purchase) => (
                                        <tr key={purchase.userPurchaseId} className="border-b border-gray-200">
                                            <td className="py-2 px-4">{purchase.userName}</td>
                                            <td className="py-2 px-4">{purchase.itemName}</td>
                                            <td className="py-2 px-4">${purchase.price}</td>
                                            <td className="py-2 px-4">{purchase.quantity}</td>
                                            <td className="py-2 px-4">{purchase.purchaseDate ? purchase.purchaseDate.toLocaleString() : 'N/A'}</td> 
                                            <td className="py-2 px-4">
                                                <a href={purchase.itemImageLink} target="_blank" rel="noopener noreferrer">  
                                                <img src={purchase.itemImageLink} alt={purchase.itemName} className="w-16 h-16 rounded-lg" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>

    )
}