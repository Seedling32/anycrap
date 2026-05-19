import Image from 'next/image';
import RefreshButton from './components/RefreshButton';

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  categories: string[];
  created_at: string;
};

type ApiResponse = {
  data: Product[];
};

async function getRandomProduct(): Promise<Product> {
  const res = await fetch('https://anycrap.shop/api/v1/products/random', {
    headers: {
      Authorization: `Bearer ${process.env.ANYCRAP_API_KEY}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();

    throw new Error(
      `Failed to fetch random product: ${res.status} ${res.statusText} - ${errorText}`,
    );
  }

  const json: ApiResponse = await res.json();

  return json.data[0];
}

export default async function Home() {
  const product = await getRandomProduct();

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="relative aspect-video w-full bg-zinc-800">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="space-y-6 p-8">
          <div className="flex justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-widest text-emerald-400">
                AI Generated Startup Idea
              </p>
              <h1 className="text-4xl font-bold">{product.name}</h1>
            </div>
            <div>
              <RefreshButton />
            </div>
          </div>

          <p className="text-lg leading-relaxed text-zinc-300">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {product.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300"
              >
                #{category}
              </span>
            ))}
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <p className="text-sm text-zinc-500">Product ID: {product.id}</p>

            <p className="text-sm text-zinc-500">Slug: {product.slug}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
