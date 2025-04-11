import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function IndexPage({ searchParams }: { searchParams: { canceled?: boolean, noselection?: boolean } }) {

  const { canceled, noselection } = await searchParams;

  if (canceled) {
    console.log(
      'Order canceled -- continue to shop around and checkout when you’re ready.'
    )
  }
  return (

    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Inventory</CardTitle>

        <h1 className="text-lg lg:text-2xl font-medium bold text-gray-900 mb-6">
          Purchase Items
        </h1>

        <div>
          {/* Canceled Message */}
          {searchParams.canceled && (
            <p className="mt-4 text-red-600 text-sm font-medium">
              Your order was cancelled. Feel free to try again when you're ready.
            </p>
          )}
        </div>

        <div>
          {/* noselection Message */}
          {searchParams.noselection && (
            <p className="mt-4 text-red-600 text-sm font-medium">
              Please select an item to purchase before proceeding.
            </p>
          )}
        </div>

        <form action="/api/checkout_sessions" method="POST">
          <section>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              <div className="flex items-center border p-4 rounded-lg hover:shadow-lg transition-transform duration-300">
                {/* Product Image */}
                <img
                  src="/images/armour.jpg"
                  alt="Suit of Armour"
                  className="w-24 h-24 object-cover mr-4 rounded-md"
                />

                {/* Product Details */}
                <div className="flex flex-col flex-1">
                  {/* Item Name */}
                  <label className="text-sm font-medium text-gray-700">
                    Suit of Armour
                  </label>

                  {/* Price & Radio Button in the same row */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600 text-sm">$12.99</span>
                    <input
                      type="radio"
                      name="price_id"
                      value="price_1R6MHXLW5qRUsRs7ZLQIcQU6"
                      className="h-4 w-4 accent-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center border p-4 rounded-lg hover:shadow-lg transition-transform duration-300">
                {/* Product Image */}
                <img
                  src="/images/gold_coins.png"
                  alt="50 Gold Pieces"
                  className="w-24 h-24 object-cover mr-4 rounded-md"
                />

                {/* Product Details */}
                <div className="flex flex-col flex-1">
                  {/* Item Name */}
                  <label className="text-sm font-medium text-gray-700">
                    50 Gold Pieces
                  </label>

                  {/* Price & Radio Button in the same row */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600 text-sm">$199.99</span>
                    <input
                      type="radio"
                      name="price_id"
                      value="price_1RC5syLW5qRUsRs77ih8ghhl"
                      className="h-4 w-4 accent-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center border p-4 rounded-lg hover:shadow-lg transition-transform duration-300">
                {/* Product Image */}
                <img
                  src="/images/horse.png"
                  alt="Horse and Armour"
                  className="w-24 h-24 object-cover mr-4 rounded-md"
                />

                {/* Product Details */}
                <div className="flex flex-col flex-1">
                  {/* Item Name */}
                  <label className="text-sm font-medium text-gray-700">
                    Horse and Armor
                  </label>

                  {/* Price & Radio Button in the same row */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600 text-sm">$32.99</span>
                    <input
                      type="radio"
                      name="price_id"
                      value="price_1R6MbiLW5qRUsRs780b3w2WI"
                      className="h-4 w-4 accent-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center border p-4 rounded-lg hover:shadow-lg transition-transform duration-300">
                {/* Product Image */}
                <img
                  src="/images/hammer.png"
                  alt="Hammer"
                  className="w-24 h-24 object-cover mr-4 rounded-md"
                />

                {/* Product Details */}
                <div className="flex flex-col flex-1">
                  {/* Item Name */}
                  <label className="text-sm font-medium text-gray-700">
                    Hammer
                  </label>

                  {/* Price & Radio Button in the same row */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600 text-sm">$17.99</span>
                    <input
                      type="radio"
                      name="price_id"
                      value="price_1R6LslLW5qRUsRs77EOS9j2J"
                      className="h-4 w-4 accent-blue-600"
                    />
                  </div>
                </div>
              </div>



              <div className="flex items-center border p-4 rounded-lg hover:shadow-lg transition-transform duration-300">
                {/* Product Image */}
                <img
                  src="/images/brandycask.png"
                  alt="Cask of Brandy"
                  className="w-24 h-24 object-cover mr-4 rounded-md"
                />

                {/* Product Details */}
                <div className="flex flex-col flex-1">
                  {/* Item Name */}
                  <label className="text-sm font-medium text-gray-700">
                    Cask of Whiskey
                  </label>

                  {/* Price & Radio Button in the same row */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600 text-sm">$15.49</span>
                    <input
                      type="radio"
                      name="price_id"
                      value="price_1R6XUCLW5qRUsRs71n8nUZ5Y"
                      className="h-4 w-4 accent-blue-600"
                    />
                  </div>
                </div>
              </div>


              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="w-full md:w-auto mt-4 py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Checkout
                </button>
              </div>

            </div>
          </section>
        </form>
      </CardHeader>
    </Card>


  )
}

// import { checkoutAction } from '@/lib/payments/actions';
// import { Check } from 'lucide-react';
// import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
// import { SubmitButton } from './submit-button';

// // Prices are fresh for one hour max
// export const revalidate = 3600;

// export default async function PricingPage() {
//   const [prices, products] = await Promise.all([
//     getStripePrices(),
//     getStripeProducts(),
//   ]);

//   const basePlan = products.find((product) => product.name === 'Base');
//   const plusPlan = products.find((product) => product.name === 'Plus');

//   const basePrice = prices.find((price) => price.productId === basePlan?.id);
//   const plusPrice = prices.find((price) => price.productId === plusPlan?.id);

//   return (
//     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
//         <PricingCard
//           name={basePlan?.name || 'Base'}
//           price={basePrice?.unitAmount || 800}
//           interval={basePrice?.interval || 'month'}
//           trialDays={basePrice?.trialPeriodDays || 7}
//           features={[
//             'Unlimited Usage',
//             'Unlimited Workspace Members',
//             'Email Support',
//           ]}
//           priceId={basePrice?.id}
//         />
//         <PricingCard
//           name={plusPlan?.name || 'Plus'}
//           price={plusPrice?.unitAmount || 1200}
//           interval={plusPrice?.interval || 'month'}
//           trialDays={plusPrice?.trialPeriodDays || 7}
//           features={[
//             'Everything in Base, and:',
//             'Early Access to New Features',
//             '24/7 Support + Slack Access',
//           ]}
//           priceId={plusPrice?.id}
//         />
//       </div>
//     </main>
//   );
// }

// function PricingCard({
//   name,
//   price,
//   interval,
//   trialDays,
//   features,
//   priceId,
// }: {
//   name: string;
//   price: number;
//   interval: string;
//   trialDays: number;
//   features: string[];
//   priceId?: string;
// }) {
//   return (
//     <div className="pt-6">
//       <h2 className="text-2xl font-medium text-gray-900 mb-2">{name}</h2>
//       <p className="text-sm text-gray-600 mb-4">
//         with {trialDays} day free trial
//       </p>
//       <p className="text-4xl font-medium text-gray-900 mb-6">
//         ${price / 100}{' '}
//         <span className="text-xl font-normal text-gray-600">
//           per user / {interval}
//         </span>
//       </p>
//       <ul className="space-y-4 mb-8">
//         {features.map((feature, index) => (
//           <li key={index} className="flex items-start">
//             <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
//             <span className="text-gray-700">{feature}</span>
//           </li>
//         ))}
//       </ul>
//       <form action={checkoutAction}>
//         <input type="hidden" name="priceId" value={priceId} />
//         <SubmitButton />
//       </form>
//     </div>
//   );
// }
