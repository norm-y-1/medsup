import { Product } from '../../../shared/types'
import { formatCents } from '../../../shared/lib/money'
import { addItem } from '../../../features/cart/model/cart'
import NoPhoto from '../../../assets/img/nophoto.png'
import useImageLoaded from '../../../shared/hooks/useImageLoaded';
import Skeleton from '../../../shared/ui/Skeleton';

export function ProductCard({ product }: { product: Product }) {

  const isLoaded = useImageLoaded(product.image || "");

  return (
    <div className="card p-4 flex flex-col gap-2 cursor-pointer" data-testid="product-card">
      <div className='overflow-hidden rounded-2xl w-full h-[242px]'>
        <Skeleton width='376px' height='242px' condition={product.image ? isLoaded : true}>
          <img
            src={product.image || NoPhoto}
            alt={product.name}
            className="aspect-[4/3] w-full h-full object-contain rounded-xl hover:scale-110 transition duration-300 ease"
            loading="lazy"
          />
        </Skeleton>
      </div>
      <div className="flex-1">
        <div className="text-sm text-slate-500">{product.sku}</div>
        <h3 className="mt-1 font-semibold leading-tight">{product.name}</h3>
        <p className="mt-1 text-sm text-slate-600 line-clamp-2">{product.description}</p>
      </div>
      <div className="flex items-center justify-between pt-2">
        <span className="font-semibold">{formatCents(product.priceCents)}</span>
        <button
          className="btn btn-primary"
          onClick={() => addItem({ productId: product.id })}
        >
          Add
        </button>
      </div>
    </div>
  )
}
