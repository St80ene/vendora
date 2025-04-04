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

@Injectable()
export class OrdersService {
  constructor(
    private readonly userService: UsersService,
    private readonly productsService: ProductsService,
    private readonly orderItemsService: OrderitemsService
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
      if (!order) throw new Error('Order not found');
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
        throw new NotFoundException(errorResponse('User not found'));
      }

      await order.remove();
      return successResponse('User successfully deleted', { deleted: true });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error deleting user', error)
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
}
