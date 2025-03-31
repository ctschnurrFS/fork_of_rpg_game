"use server";

import { db } from "@/lib/db/drizzle"; // Your database instance
// import { getUser, createPurchase } from "@/lib/db/queries";
import { getUser } from "@/lib/db/queries";
import { stripe } from "@/lib/payments/stripe"
import { InsertUserPurchase } from "@/lib/db/schema"

export async function recordPurchase(sessionId: string) {
  const user = await getUser();
  if (!user) throw new Error("User not found");

  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "payment_intent"],
  });

  if (!stripeSession) throw new Error("Invalid Stripe session");

  const { customer_details, line_items, payment_status } = stripeSession;

//   // Insert purchase record into database
//   await db.insert()
//     data: {
//       userId: user.id,
//       email: customer_details?.email || "",
//       status: payment_status,
//       items: JSON.stringify(line_items?.data || []),
//       totalAmount: stripeSession.amount_total,
//       stripeSessionId: sessionId,
//     },
//   });

  console.log("Purchase recorded successfully");
}
