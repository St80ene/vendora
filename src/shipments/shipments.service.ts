import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Shipment } from './entities/shipment.entity';
import {
  ApiResponse,
  errorResponse,
  successResponse,
} from 'src/utils/response.utils';
import { Order } from 'src/orders/entities/order.entity';
import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { sendEmailNotification } from 'src/utils/notifications.utils';
import { ShipmentStatus } from './enums/shipment-status.enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ShipmentsService {
  async create(createShipmentDto: CreateShipmentDto) {
    try {
      const shipment = new Shipment();
      shipment.status = 'pending'; // Set initial status
      await shipment.save();

      return {
        success: true,
        message: 'Shipment created successfully',
        shipment,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error creating shipment', error);
    }
  }

  async findAll({
    page = 1,
    limit = 10,
  }): Promise<ApiResponse<{ shipments: Shipment[]; total: number }>> {
    try {
      const pageNumber = page || 1;
      const skip = (pageNumber - 1) * limit;

      const [shipments, total] = await Shipment.findAndCount({
        take: limit,
        skip,
        relations: { order: true, address: true },
      });

      return successResponse('Shipments for user retrieved successfully', {
        shipments,
        total,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error fetching orders', error)
      );
    }
  }

  async findOne(id: string) {
    try {
      const shipment = await Shipment.findOne({ where: { id } });
      if (!shipment) {
        throw new NotFoundException('Shipment not found');
      }
      return {
        success: true,
        shipment,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching shipment', error);
    }
  }
  async update(
    id: string,
    updateShipmentDto: UpdateShipmentDto
  ): Promise<ApiResponse<Shipment>> {
    try {
      const shipment = await Shipment.findOne({ where: { id } });
      if (!shipment) {
        throw new NotFoundException('Shipment not found');
      }

      // Update shipment details
      Object.assign(shipment, updateShipmentDto);
      await shipment.save();

      return successResponse('User updated successfully', shipment);
    } catch (error) {
      throw new InternalServerErrorException('Error updating shipment', error);
    }
  }

  // Remove a shipment
  async remove(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      const shipment = await Shipment.findOne({ where: { id } });
      if (!shipment) {
        throw new NotFoundException('Shipment not found');
      }

      await shipment.remove();
      return successResponse('Order successfully deleted', { deleted: true });
    } catch (error) {
      throw new InternalServerErrorException('Error deleting shipment', error);
    }
  }

  async createShippingLabel(order: Order) {
    try {
      const label = this.generateLabel(order);

      // Step 2: Save the label locally (e.g., as a file on the server)
      const labelFilePath = `/public/shipping/shipping_labels/order_${order.id}_label.pdf`;
      writeFileSync(labelFilePath, label); // This is just a placeholder. Replace with actual file creation logic.

      return labelFilePath;
    } catch (error) {
      console.error('Shipping label creation error:', error.message);
      return null; // Returning null if label creation fails
    }
  }

  generateLabel(order: Order) {
    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Shipping Label for Order: ${order.id}`, 20, 40);
    ctx.fillText(`Address: ${order.shipment.address}`, 20, 80);
    ctx.fillText(`Items: ${order.order_items.length}`, 20, 120);

    // More details can be added, e.g., order items, dimensions, etc.
    return canvas.toBuffer('image/png'); // Example: Saving it as an image. You can replace this with PDF generation.
  }

  createTrackingNumber(order_id: string): number {
    const timestamp = new Date().getTime();
    const trackingNumber = `TRACK-${order_id}-${timestamp}-${Math.random().toString(36).substring(2, 15)}`;

    return Number(trackingNumber);
  }

  async sendShippingNotification({
    user,
    order_id,
    tracking_number,
  }: {
    user: User;
    order_id: string;
    tracking_number: number;
  }) {
    try {
      // Simulate sending an email or SMS notification to the customer
      const customer = user;
      const message = `Your order ${order_id} has been shipped! You can track it using the tracking number: ${tracking_number}`;

      // Standard subject line for shipping notifications
      const subject = `Your Order #${order_id} Has Shipped!`;

      // Example of sending an email or SMS
      await sendEmailNotification(customer, subject, message);
    } catch (error) {
      console.error('Shipping notification error:', error.message);
    }
  }

  async handleShippingAndDelivery(order: Order): Promise<Shipment> {
    try {
      // Step 1: Generate the shipping label locally
      const shippingLabelPath = await this.createShippingLabel(order);

      if (!shippingLabelPath) {
        throw new Error('Shipping label creation failed');
      }

      // Step 2: Create a tracking number locally (this can be a simple random string or based on order details)
      const trackingNumber = this.createTrackingNumber(order.id);

      const updated_shipment = await this.update(order.shipment.id, {
        label_url: shippingLabelPath,
        status: ShipmentStatus.SHIPPED,
        shipped_at: new Date(),
        tracking_number: trackingNumber,
      });

      order.status = ShipmentStatus.SHIPPED;

      order.save();

      await this.sendShippingNotification({
        user: order.user,
        tracking_number: trackingNumber,
        order_id: order.id,
      });

      return updated_shipment.data;
    } catch (error) {
      console.error('Shipping and delivery error:', error.message);
      throw error;
    }
  }
}
