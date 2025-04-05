import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { OrderItem } from './entities/orderitem.entity';
import { CreateOrderItemDto } from './dto/create-orderitem.dto';
import { UpdateOrderitemDto } from './dto/update-orderitem.dto';
import {
  ApiResponse,
  errorResponse,
  successResponse,
} from 'src/utils/response.utils';

@Injectable()
export class OrderitemsService {
  async create(
    createOrderitemDto: CreateOrderItemDto
  ): Promise<ApiResponse<OrderItem>> {
    try {
      const orderItem = OrderItem.create(createOrderitemDto);
      await orderItem.save();
      return successResponse('Order item created successfully', orderItem);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error creating order item', error)
      );
    }
  }

  async findAll({
    page = 1,
    limit = 10,
  }): Promise<ApiResponse<{ orderItems: OrderItem[]; total: number }>> {
    try {
      const skip = (page - 1) * limit;

      const [orderItems, total] = await OrderItem.findAndCount({
        take: limit,
        skip,
        relations: {
          order: true,
          product: true,
        },
      });

      return successResponse('Order items retrieved successfully', {
        orderItems,
        total,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error fetching order items', error)
      );
    }
  }

  async findOne(id: string): Promise<ApiResponse<OrderItem>> {
    try {
      const orderItem = await OrderItem.findOne({
        where: { id },
        relations: {
          order: true,
          product: true,
        },
      });

      if (!orderItem) {
        throw new NotFoundException(errorResponse('Order item not found'));
      }

      return successResponse('Order item retrieved successfully', orderItem);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error fetching order item', error)
      );
    }
  }

  async update(
    id: string,
    updateOrderitemDto: UpdateOrderitemDto
  ): Promise<ApiResponse<OrderItem>> {
    try {
      const existingItem = await this.findOne(id);
      Object.assign(existingItem.data, updateOrderitemDto);
      await existingItem.data.save();

      return successResponse(
        'Order item updated successfully',
        existingItem.data
      );
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error updating order item', error)
      );
    }
  }

  async remove(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      const orderItem = await OrderItem.findOne({ where: { id } });

      if (!orderItem) {
        throw new NotFoundException(errorResponse('Order item not found'));
      }

      await orderItem.remove();

      return successResponse('Order item successfully deleted', {
        deleted: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error deleting order item', error)
      );
    }
  }
}
