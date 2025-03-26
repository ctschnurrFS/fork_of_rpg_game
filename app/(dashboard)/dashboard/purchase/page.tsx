import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function IndexPage({ searchParams }: { searchParams: { canceled?: boolean, noselection?: boolean } }) {

  const { canceled, noselection } = await searchParams

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
                  src="/images/f-15.jpg"
                  alt="F-15 Eagle"
                  className="w-24 h-24 object-cover mr-4 rounded-md"
                />

                {/* Product Details */}
                <div className="flex flex-col flex-1">
                  {/* Item Name */}
                  <label className="text-sm font-medium text-gray-700">
                    F-15 Eagle
                  </label>

                  {/* Price & Radio Button in the same row */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600 text-sm">$19.99</span>
                    <input
                      type="radio"
                      name="price_id"
                      value="price_1R55rGLW5qRUsRs7diYUStyX"
                      className="h-4 w-4 accent-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center border p-4 rounded-lg hover:shadow-lg transition-transform duration-300">
                {/* Product Image */}
                <img
                  src="/images/horse.png"
                  alt="Horse"
                  className="w-24 h-24 object-cover mr-4 rounded-md"
                />

                {/* Product Details */}
                <div className="flex flex-col flex-1">
                  {/* Item Name */}
                  <label className="text-sm font-medium text-gray-700">
                    Horse
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
                    Whisky Barrel
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