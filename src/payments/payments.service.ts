import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Order } from 'src/orders/entities/order.entity';
import { PaymentMethod } from './enums/payment-method.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import {
  ApiResponse,
  errorResponse,
  successResponse,
} from 'src/utils/response.utils';

@Injectable()
export class PaymentsService {
  constructor() {}

  // Create a new payment
  async create(
    createPaymentDto: CreatePaymentDto
  ): Promise<ApiResponse<Payment>> {
    const { order_id, amount, payment_method } = createPaymentDto;

    try {
      // Fetch the associated order
      const order = await Order.findOne({
        where: { id: order_id },
      });

      if (!order) {
        throw new NotFoundException(
          errorResponse('Order not found', { order_id })
        );
      }

      // Validate the payment method (ensures only valid methods are used)
      if (!Object.values(PaymentMethod).includes(payment_method)) {
        throw new BadRequestException(
          errorResponse('Invalid payment method', { payment_method })
        );
      }

      // Create and save payment
      const payment = Payment.create({
        amount,
        payment_method,
        status: PaymentStatus.PENDING,
        order,
      });

      await payment.save();

      return successResponse('Payment created successfully', payment);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error creating payment', error)
      );
    }
  }

  // Find all payments for a user
  async paymentHistory({
    page = 1,
    limit = 10,
    user_id,
  }: {
    page?: number;
    limit?: number;
    user_id: string;
  }): Promise<ApiResponse<{ payments: Payment[]; total: number }>> {
    try {
      const skip = (page - 1) * limit;

      const [payments, total] = await Payment.findAndCount({
        where: { order: { user: { id: user_id } } },
        take: limit,
        skip,
        relations: { order: { user: true, shipment: true } },
      });

      return successResponse('Payment history retrieved successfully', {
        payments,
        total,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error fetching payment history', error)
      );
    }
  }

  // Find a payment by ID
  async findOne(id: string): Promise<ApiResponse<Payment>> {
    try {
      const payment = await Payment.findOne({
        where: { id },
        relations: { order: { user: true } },
      });

      if (!payment) {
        throw new NotFoundException(errorResponse('Payment not found', { id }));
      }

      return successResponse('Payment found successfully', payment);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error finding payment by ID', error)
      );
    }
  }

  // Find a payment by Order ID
  async findOneUsingOrderId(order_id: string): Promise<ApiResponse<Payment>> {
    try {
      const payment = await Payment.findOne({
        where: { order: { id: order_id } },
        relations: { order: { user: true } },
      });

      if (!payment) {
        throw new NotFoundException(
          errorResponse('Payment not found for the given order', { order_id })
        );
      }

      return successResponse('Payment found successfully', payment);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error finding payment by Order ID', error)
      );
    }
  }

  // Update a payment's status
  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto
  ): Promise<ApiResponse<Payment>> {
    try {
      if (updatePaymentDto.status) {
        if (!Object.values(PaymentStatus).includes(updatePaymentDto.status)) {
          // Ensure status is valid
          throw new BadRequestException(
            errorResponse('Invalid payment status', {
              status: updatePaymentDto.status,
            })
          );
        }
      }

      const { data: payment } = await this.findOne(id);
      if (!payment) {
        throw new NotFoundException(errorResponse('Payment not found', { id }));
      }

      Object.assign(payment, updatePaymentDto);

      // Update payment status and save
      await payment.save();

      return successResponse('Payment updated successfully', payment);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error updating payment', error)
      );
    }
  }

  // Process the payment (usually would be called after a successful initiation)
  async processPayment(payment_id: string): Promise<ApiResponse<Payment>> {
    try {
      const { data: payment } = await this.findOne(payment_id);
      if (!payment) {
        throw new NotFoundException(
          errorResponse('Payment not found', { payment_id })
        );
      }

      // Set the payment status to processing or any relevant status before confirming
      payment.status = PaymentStatus.PROCESSING;
      await payment.save();

      // Further logic for payment processing, e.g., interacting with a payment gateway

      // After successful payment processing, update the status
      payment.status = PaymentStatus.SUCCESS;
      await payment.save();

      return successResponse('Payment processed successfully', payment);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error processing payment', error)
      );
    }
  }
}
