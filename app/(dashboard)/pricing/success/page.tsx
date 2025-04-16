import { redirect } from 'next/navigation'
import { stripe } from "@/lib/payments/stripe"
import { db } from '@/lib/db/drizzle'
import { userPurchasesTable } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription  } from '@/components/ui/card';
// import { Button } from '@/components/ui/Button';
import { Button } from '@/components/ui/button';
import { getTeamForUser, getUser } from '@/lib/db/queries';
import { NextResponse } from "next/server";
import { CheckCircle, type LucideIcon, } from 'lucide-react';

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
  // Calculate total amount
  //const totalAmount = line_items?.data?.reduce((sum, item) => sum + item.amount_total, 0) / 100 || 0;

  // Determine the best display name/email
  const displayName = user?.name || customerEmail?.split('@')[0] || 'Valued Customer'; // Fallback display name
  const confirmationEmail = user?.email || customerEmail || 'your email address'; // Fallback email

    return (
      <section id="success" className="flex justify-center items-start min-h-screen bg-gray-50 px-4 py-12 md:py-16">
        <Card className="w-full max-w-lg shadow-xl border border-gray-200">
          <CardHeader className="text-center p-6 bg-gradient-to-br from-green-50 to-white">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Payment Successful!</CardTitle>
            <CardDescription className="mt-2 text-md text-gray-600">
              Thank you for your purchase, <span className="font-semibold">{displayName}</span>!
            </CardDescription>
            <p className="text-sm text-gray-500 mt-1">
              A confirmation receipt has been sent to <span className="font-medium">{confirmationEmail}</span>.
            </p>
          </CardHeader>
  
          <CardContent className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <h2 className="text-lg font-semibold text-gray-800 bg-gray-100 px-4 py-3 border-b border-gray-200">
                Order Summary
              </h2>
              <ul className="divide-y divide-gray-200">
                {line_items?.data?.map((item) => (
                  <li key={item.id} className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-gray-700">
                      {item.quantity} x {item.description}
                    </span>
                    <span className="font-medium text-gray-900">
                      ${(item.amount_total / 100).toFixed(2)}
                    </span>
                  </li>
                ))}
                {/* Total Amount */}
                <li className="flex justify-between items-center px-4 py-3 bg-gray-50 text-sm font-semibold">
                  <span className="text-gray-800">Total Amount</span>
                  <span className="text-gray-900">${price}</span>
                </li>
              </ul>
            </div>
  
            {/* Payment Status */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Payment Status: <span className="font-medium text-green-700 capitalize bg-green-100 px-2 py-0.5 rounded-full">{payment_status?.replace('_', ' ')}</span>
              </p>
            </div>
  
            {/* Optional User Info - uncomment if needed, but often receipt email is enough */}
            {/*
            {user && (
              <div className="text-center text-xs text-gray-500">
                <p>Account: {user.name} ({user.email})</p>
                <p>Role: {user.role}</p>
              </div>
            )}
            */}
  
          </CardContent>
  
          <CardFooter className="p-6 border-t border-gray-200 bg-gray-50 flex justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <a href="/">Return to the Game</a>
            </Button>
          </CardFooter>
        </Card>
      </section>
    );
  }
}