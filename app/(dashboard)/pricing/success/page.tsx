import { redirect } from 'next/navigation'
import { stripe } from "@/lib/payments/stripe"
import { db } from '@/lib/db/drizzle'
import { userPurchasesTable } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTeamForUser, getUser } from '@/lib/db/queries';
import { NextResponse } from "next/server";

export default async function Success({ searchParams }: { searchParams: { session_id?: string } }) {

  const user = await getUser();
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  });

  const customerEmail = (session.customer_details as { email?: string })?.email;
  const { customer_details, line_items, payment_status } = session;


  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete') {

    const userIdPurchase = user?.id;
    const firstLineItem = line_items?.data[0];
    const price =  ((firstLineItem?.amount_total ?? 0) / 100).toFixed(2);

    let itemImageLink;
    switch (firstLineItem?.description) {
      case "Hammer":
        itemImageLink = "/images/hammer.png";
        break; 
    
        case "Horse and Armour":
          itemImageLink = "/images/horse.png";
        break;

        case "Suit of Armour":
          itemImageLink = "/images/armour.jpg";
        break;

        case "50 Gold Pieces":
          itemImageLink = "/images/gold_coins.png";
        break;   
        
        case "Cask of Whiskey":
          itemImageLink = "/images/brandycask.png";
        break;
    
      // ... potentially more cases
    
      default: 
        itemImageLink = "/images/hammer.png";
    }    
    
    const insertedPurchase = await db.insert(userPurchasesTable).values({
      userId: userIdPurchase,
      itemName: firstLineItem?.description,
      price: price,
      quantity: firstLineItem?.quantity,
      userName: user?.name,
      itemImageLink: itemImageLink,
    }).returning();

    //////////////////////////////////////////////////////////////

    return (
      <section id="success">

<Card className="mb-8 border border-gray-200 shadow-lg">
  <CardHeader className="p-6 text-center">
    <div className="flex items-center justify-center text-green-500">
      ✅ {/* Or use an icon library like Lucide */}
    </div>
    <CardTitle className="text-xl font-semibold mt-4">Payment Successful!</CardTitle>

    <p className="text-gray-600 mt-2">Thank you for your purchase, <span className="font-semibold">{ user?.name } {customerEmail}</span>!</p>
    <p className="text-gray-600 mt-2">User Name: { user?.name } </p>
    <p className="text-gray-600 mt-2">User Email: { user?.email } </p>
    <p className="text-gray-600 mt-2">User Role: {user?.role}</p>
    
    <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium text-gray-800">Order Details</h2>
      <ul className="mt-2 space-y-2">
        {line_items?.data?.map((item) => (
          <li key={item.id} className="flex justify-between p-2 bg-white rounded-md shadow">
            <span>{item.quantity} x {item.description}</span>
            <span className="font-medium">${(item.amount_total / 100).toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>

    <p className="mt-4 text-gray-700 font-medium">Status: <span className="text-green-600">{payment_status}</span></p>

    <div className="mt-6">
      <a href="/" className="text-blue-600 hover:underline">Return to the Game</a>
    </div>
  </CardHeader>
</Card>

      </section>
    )
  }
}