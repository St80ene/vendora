import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PaystackService } from './paystack.service';

@Controller('paystack')
export class PaystackController {
  constructor(private readonly paystackService: PaystackService) {}

  @Post('initialize')
  async initiatePayment(
    @Body('amount') amount: number,
    @Body('email') email: string
  ) {
    const paymentData = await this.paystackService.initiatePayment(
      amount,
      email
    );
    return paymentData;
  }

  @Get('verify/:reference')
  async verifyPayment(@Param('reference') reference: string) {
    const verificationData =
      await this.paystackService.verifyTransaction(reference);
    return verificationData;
  }

  @Post('webhook')
  async handleWebhook(@Body() payload: any) {
    return this.paystackService.handleWebhook(payload);
  }
}
