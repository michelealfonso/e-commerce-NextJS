import Link from "next/link";

async function getProducts() {
    const response = await fetch('https://fakestoreapi.com/products');
    return response.json();
}

export default async function Products() {
    const products = await getProducts();

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
            {products.map((product: any) => (
                <Link
                // `/product/${product.id}`
                    href={''}
                    key={product.id}
                    className="group"
                >
                    <div className="border border-gray-200 rounded-md p-2 hover:shadow-md transition-shadow">
                        <div className="aspect-square overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            />
                        </div>
                        <div className="mt-2 px-1">
                            <h2 className="text-sm font-medium line-clamp-2 h-10 overflow-hidden">
                                {product.title}
                            </h2>
                            <div className="mt-1 flex items-center">
                                <span className="text-xs text-yellow-500">★★★★★</span>
                                <span className="text-xs text-gray-500 ml-1">(0)</span>
                            </div>
                            <p className="text-sm font-bold mt-1">${product.price}</p>
                            {product.price > 20 && (
                                <p className="text-xs text-gray-600">Spedizione gratuita</p>
                            )}
                            <button className="p-[2px] text-[15px] bg-[#FFD814] rounded-full cursor-pointer"> Aggiungi al carrello </button>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}