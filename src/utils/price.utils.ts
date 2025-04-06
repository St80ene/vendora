import { NotFoundException } from '@nestjs/common';
import { errorResponse } from './response.utils';
import { Product } from 'src/products/entities/product.entity';
import { OrderItem } from 'src/orderitems/entities/orderitem.entity';

export const priceCalculation = (order_items: OrderItem[]): number => {
  try {
    let computed_total = 0;

    // Use forEach to iterate over the order items
    order_items.forEach(({ price, quantity, total, product }) => {
      // Check if the associated product exists
      if (!product)
        throw new NotFoundException(
          errorResponse('Associated product for this order item not found')
        );

      // Check if requested quantity exceeds available stock
      if (quantity > product.stock)
        throw new NotFoundException(
          errorResponse('Requested quantity is more than stock available')
        );

      // Get the base product price
      let product_price = product.price;

      // Apply any discounts or promo codes
      if (product.discount_value) {
        product_price = productDiscountPrice(product);
      }

      // Calculate the total for this item (price * quantity)
      const item_total = product_price * quantity;

      // Optionally, check if the total matches the calculated price (good validation)
      if (total !== item_total) {
        throw new Error('Order item total does not match calculated price');
      }

      // Accumulate the total for all items
      computed_total += item_total;
    });

    // Return the final computed total
    return computed_total;
  } catch (error) {
    throw new NotFoundException(
      errorResponse(
        error.message || 'An error occurred during order validation'
      )
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
