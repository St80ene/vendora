import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PaystackService {
  private readonly paystackSecretKey: string =
    process.env.PAYMENT_GATEWAY_SECRET_KEY; // Replace with your secret key
  private readonly paystackBaseUrl: string = 'https://api.paystack.co';

  async initiatePayment(amount: number, email: string): Promise<any> {
    const response = await axios.post(
      `${this.paystackBaseUrl}/transaction/initialize`,
      {
        amount: amount * 100, // Paystack expects the amount in kobo (1 Naira = 100 Kobo)
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${this.paystackSecretKey}`,
        },
      }
    );
    return response.data;
  }

  async verifyTransaction(reference: string): Promise<any> {
    const response = await axios.get(
      `${this.paystackBaseUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${this.paystackSecretKey}`,
        },
      }
    );
    return response.data;
  }

  async handleWebhook(payload) {}
}
