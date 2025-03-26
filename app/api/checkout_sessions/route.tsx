import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from "@/lib/payments/stripe"

export async function POST(req: Request) {
  try {

    const headersList = await headers();
    const origin = headersList.get('origin');

    const formData = await req.formData();
    const priceId = formData.get('price_id') as string; // Get selected price_id and cast to string

    if (!priceId) {
      // Construct the full URL for the redirect
      // Absolute URL to /dashboard with fallback
      const redirectUrl = new URL('/dashboard/purchase?noselection=true', origin || 'http://localhost:3000'); 

      return NextResponse.redirect(redirectUrl.toString());
    }    

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product
          //price: 'price_1R55rGLW5qRUsRs7diYUStyX',
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',  // one time payment as opposed to subscription/ future payments
      success_url: `${origin}/dashboard/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      //cancel_url: `${origin}/?canceled=true`,
      cancel_url: `${origin}/dashboard/purchase?canceled=true`,
    });
    if (!session.url) {
      return NextResponse.json(
        { error: "Session URL is null" },
        { status: 500 }
      );
    }
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    const statusCode = err instanceof Error && 'statusCode' in err ? (err as any).statusCode : 500;
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}