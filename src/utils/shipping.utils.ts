import { writeFileSync } from 'fs';
import { createCanvas } from 'canvas'; // To generate an image for the label (optional)
import { Order } from 'src/orders/entities/order.entity';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import { sendEmailNotification } from './notifications.utils';

export const createShippingLabel = async (order: Order) => {
  try {
    // Step 1: Create a basic shipping label (for demonstration, you can generate a PDF or image)
    const label = generateLabel(order);

    // Step 2: Save the label locally (e.g., as a file on the server)
    const labelFilePath = `/public/shipping/shipping_labels/order_${order.id}_label.pdf`;
    writeFileSync(labelFilePath, label); // This is just a placeholder. Replace with actual file creation logic.

    return labelFilePath; // Return the file path to the generated shipping label
  } catch (error) {
    console.error('Shipping label creation error:', error.message);
    return null; // Returning null if label creation fails
  }
};

// Helper function to generate a simple shipping label
export const generateLabel = (order: Order) => {
  const canvas = createCanvas(400, 200);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Shipping Label for Order: ${order.id}`, 20, 40);
  ctx.fillText(`Address: ${order.shipment.address}`, 20, 80);
  ctx.fillText(`Items: ${order.order_items.length}`, 20, 120);

  // More details can be added, e.g., order items, dimensions, etc.
  return canvas.toBuffer('image/png'); // Example: Saving it as an image. You can replace this with PDF generation.
};

export const createTrackingNumber = (order: Order) => {
  const timestamp = new Date().getTime();
  const trackingNumber = `TRACK-${order.id}-${timestamp}-${Math.random().toString(36).substring(2, 15)}`;

  return trackingNumber;
};

export const handleShippingAndDelivery = async (order: Order) => {
  try {
    // Step 1: Generate the shipping label locally
    const shippingLabelPath = await createShippingLabel(order);

    if (!shippingLabelPath) {
      throw new Error('Shipping label creation failed');
    }

    // Step 2: Create a tracking number locally (this can be a simple random string or based on order details)
    const trackingNumber = createTrackingNumber(order);

    // Step 3: Update the order with the shipping label URL and tracking number
    const updatedOrder = await updateShippingInfo(
      order.id,
      shippingLabelPath,
      trackingNumber
    );

    // Step 4: Notify the customer about the shipment and tracking info (via email/SMS, etc.)
    await sendShippingNotification(updatedOrder);

    return updatedOrder;
  } catch (error) {
    console.error('Shipping and delivery error:', error.message);
    throw error;
  }
};

export const updateShippingInfo = async (
  shipment,
  shippingLabelPath,
  trackingNumber
) => {
  try {
    if (!shipment) {
      throw new Error('Order not found');
    }

    shipment.label_url = shippingLabelPath;
    shipment.tracking_number = trackingNumber;
    shipment.status = OrderStatus.SHIPPED; // Mark the order as shipped
    shipment.status = OrderStatus.SHIPPED; // Mark the order as shipped

    // Save the updated order
    await shipment.save();

    return shipment;
  } catch (error) {
    console.error('Error updating order:', error.message);
    throw error;
  }
};

export const sendShippingNotification = async (order) => {
  try {
    // Simulate sending an email or SMS notification to the customer
    const customer = order.user;
    const message = `Your order ${order.id} has been shipped! You can track it using the tracking number: ${order.tracking_number}`;

    // Standard subject line for shipping notifications
    const subject = `Your Order #${order.id} Has Shipped!`;

    // Example of sending an email or SMS
    await sendEmailNotification(customer, subject, message);
  } catch (error) {
    console.error('Shipping notification error:', error.message);
  }
};
