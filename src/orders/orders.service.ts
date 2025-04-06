import { OrderItem } from 'src/orderitems/entities/orderitem.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import {
  ApiResponse,
  errorResponse,
  successResponse,
} from 'src/utils/response.utils';
import { Order } from './entities/order.entity';
import { OrderitemsService } from 'src/orderitems/orderitems.service';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { priceCalculation } from 'src/utils/price.utils';

@Injectable()
export class OrdersService {
  constructor(
    private readonly userService: UsersService,
    private readonly productsService: ProductsService,
    private readonly orderItemsService: OrderitemsService,
    private readonly shipmentService: ShipmentsService
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<ApiResponse<Order>> {
    try {
      const { user_id } = createOrderDto;

      const existing_order = await Order.findOne({
        where: { user: { id: user_id } },
      });

      if (existing_order) {
        return successResponse('Order already exists for user', existing_order);
      }

      const existing_user = await this.userService.findById(user_id);

      if (existing_user) {
        const order = Order.create();
        order.user = existing_user.data;

        await order.save();

        return successResponse('Order created successfully for user', order);
      } else {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error creating order', error);
    }
  }

  async findAll({
    page = 1,
    limit = 10,
    user_id,
  }): Promise<ApiResponse<{ orders: Order[]; total: number }>> {
    try {
      const pageNumber = page || 1;
      const skip = (pageNumber - 1) * limit;

      const [orders, total] = await Order.findAndCount({
        where: { user: { id: user_id } },
        take: limit,
        skip,
        relations: { user: true },
      });

      return successResponse('Orders for user retrieved successfully', {
        orders,
        total,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error fetching orders', error)
      );
    }
  }

  async viewOrder(id: string): Promise<ApiResponse<Order>> {
    try {
      const order = await Order.findOne({
        where: { id },
        relations: { user: true, order_items: true },
      });
      if (!order) {
        throw new NotFoundException(errorResponse('Order not found'));
      }
      return successResponse('Order fetched successfully', order);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error viewing Order', error)
      );
    }
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto
  ): Promise<ApiResponse<Order>> {
    try {
      const order = await this.viewOrder(id);
      Object.assign(order.data, updateOrderDto);
      await order.data.save();
      return successResponse('User updated successfully', order.data);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error updating order', error)
      );
    }
  }

  async remove(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      const order = await Order.findOne({ where: { id } });
      if (!order) {
        throw new NotFoundException(errorResponse('Order not found'));
      }

      await order.remove();
      return successResponse('Order successfully deleted', { deleted: true });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error deleting order', error)
      );
    }
  }

  async addProductToOrder({
    order_id,
    product_id,
    quantity = 1,
  }: {
    order_id: string;
    product_id: string;
    quantity?: number;
  }): Promise<string> {
    try {
      // 1. Check if order exists and is still pending
      const order = await this.viewOrder(order_id);

      if (!order) {
        throw new NotFoundException('Order not found or is already completed');
      }

      // 2. Check if product exists and is in stock
      const { data: product_data } =
        await this.productsService.findOne(product_id);

      if (!product_data || product_data.stock < quantity) {
        throw new NotFoundException('Product not available or out of stock');
      }

      // 3. Check if product is already part of the order
      const existingItem = order.data.order_items.find(
        (item) => item.product.id === product_id
      );

      if (existingItem) {
        // 4. If exists, update quantity and save
        existingItem.quantity += quantity;
        await existingItem.save();
      } else {
        // 5. If not, create a new OrderItem
        await this.orderItemsService.create({
          order_id,
          product_id,
          quantity,
          price: product_data.price,
        });
      }

      return 'Product added to order successfully';
    } catch (error) {
      throw new InternalServerErrorException(
        'Error adding product to order',
        error
      );
    }
  }

  async checkout(order_id: string) {
    try {
      // cart validation
      // shipping details
      // payment initialization
      // order summary review
      // notifications
      // fulfillment and shipping
      const existing_order = await Order.findOne({
        where: { id: order_id },
        relations: {
          user: true,
          shipment: { address: true },
          order_items: { product: { category: true } },
        },
      });

      if (!existing_order) {
        throw new NotFoundException('Order not found');
      }

      const { order_items, shipment } = existing_order;

      // initiate payment process

      const price_of_items = priceCalculation(order_items);

      const paymentData = {
        amount: price_of_items * 100, // Amount in the smallest currency unit (kobo or cents)
        email: existing_order.user.email, // Customer's email
        order_id: existing_order.id, // The order ID (used for tracking)
        callback_url: 'your_callback_url', // The URL to call after payment completion
        currency: 'NGN', // Change this to your desired currency if necessary
      };

      // Step 2: Validate shipping details (address, etc.)
      const { address } = shipment;
      if (!address || !address.phone || !address.city || !address.zip_code) {
        throw new Error('Shipping address is incomplete');
      }

      // Step 4: Handle Shipping and Delivery (Create shipping label and tracking number)
      const updated_shipment =
        await this.shipmentService.handleShippingAndDelivery(existing_order);

      if (!updated_shipment) {
        throw new Error('Shipping and delivery process failed');
      }

      // Return success response with tracking number and label URL
      return {
        success: true,
        message: 'Order successfully processed and shipped',
        tracking_number: updated_shipment.tracking_number,
        shipping_label: updated_shipment.label_url,
        shipped_at: updated_shipment.shipped_at,
      };
    } catch (error) {
      // Handle errors and throw a response with the error message
      throw new Error(
        error.message || 'An error occurred during shipment processing'
      );
    }
  }
}
