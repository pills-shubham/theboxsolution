"use client"

import { useEffect, useState } from "react"
import { productService } from "@/services/products"
import { Product, ProductDimension } from "@/services/types"
import { ProductCard } from "@/components/product-card"
import { Navbar } from "@/components/navbar"
import { Skeleton } from "@/components/ui/skeleton"

type ProductWithDimensions = Product & { product_dimensions: ProductDimension[] }

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithDimensions[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const prodList = await productService.listProducts()
        const fullProds = await Promise.all(
          prodList.map(p => productService.getProduct(p.id))
        )
        setProducts(fullProds)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Navbar />
      <main className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Our Packaging Solutions</h1>
          <p className="text-muted-foreground text-lg">Premium boxes and mailers for every need.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[400px] bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
