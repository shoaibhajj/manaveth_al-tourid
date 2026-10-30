'use client'

import type { Product } from '@/lib/content/products'
import { ProductCard } from './product-card'
import { RevealItem } from './reveal'

export function ProductsGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, i) => (
        <RevealItem key={product.id} delay={(i % 3) * 0.1}>
          <ProductCard product={product} />
        </RevealItem>
      ))}
    </ul>
  )
}
