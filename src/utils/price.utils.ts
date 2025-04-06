import { NotFoundException } from '@nestjs/common';
import { errorResponse } from './response.utils';
import { Product } from 'src/products/entities/product.entity';
import { PromoCode } from 'src/promo_codes/entities/promo_code.entity';
import { OrderItem } from 'src/orderitems/entities/orderitem.entity';

export const priceCalculation = async (order_items: OrderItem[]) => {
  // fetch order if exists and associated order items
  // Checking if product exists and is in stock
  // Validating quantities doesn’t exceed stock for each item
  // Ensuring cart totals are correct
  // Basic discount or promo code logic

  try {
    let computed_total = 0;

    order_items.map(({ price, quantity, total, product }) => {
      // check if product exists
      if (!product)
        throw new NotFoundException(
          errorResponse('Associated product for this order item not found')
        );
      // check if requested quantity is more than is in stock
      if (quantity > product.stock)
        throw new NotFoundException(
          errorResponse('Requested quantity is more than stock available')
        );

      // check product description
      // get price
      let product_price = product.price;

      // check for discounts or promos
      if (product.discount_value) {
        product_price = productDiscountPrice(product);
      }

      // compute price total
      computed_total = +price * product_price;

      // Check if total matches calculated price (optional validation)
      if (total !== computed_total) {
        throw new Error('Order item total does not match calculated price');
      }
    });

    return computed_total;
  } catch (error) {
    throw new NotFoundException(
      errorResponse(error || 'An error occurred during order validation')
    );
  }
};

export const productDiscountPrice = ({
  price,
  discount_value,
  discount_type,
  discount_expires_at,
}: Product) => {
  const now = new Date();

  let discounted_price = price;
  if (
    discount_value &&
    discount_expires_at &&
    new Date(discount_expires_at) > now
  ) {
    if (discount_type === 'percentage') {
      discounted_price = price - (price * discount_value) / 100;
    } else if (discount_type === 'fixed') {
      discounted_price = price - discount_value;
    }
  }

  return discounted_price;
};

// export const productPromo = ({
//   promo_code: {
//     value,
//     type,
//     is_active,
//     expires_at,
//   },
//   product,
// }: {
//   promo_code: PromoCode;
//   product: Product;
// }) => {
//   let discounted_price = product.price;
//   const now = new Date();
//   if (is_active && new Date(expires_at) > now) {
//     const appliesToProduct = applies_to_product_id === product.id;
//     const appliesToCategory = applies_to_category_id === product.category?.id;

//     if (
//       appliesToProduct ||
//       appliesToCategory ||
//       (!applies_to_category_id && !applies_to_product_id)
//     ) {
//       if (type === 'percentage') {
//         discounted_price = product.price - (product.price * value) / 100;
//       } else if (type === 'fixed') {
//         discounted_price = product.price - value;
//       }
//     }
//   }

//   return discounted_price;
// };
