import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendOrderConfirmation } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);

        // Update order status in database
        const order = await prisma.order.findFirst({
          where: {
            paymentIntentId: paymentIntent.id,
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
            user: true,
          },
        });

        if (order) {
          // Update order status
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'paid',
            },
          });

          // Send confirmation email
          await sendOrderConfirmation(
            order.user.email || '',
            order.id,
            order.total,
            order.items.map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.price,
            }))
          );
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('Payment failed:', paymentIntent.id);

        // Update order status
        await prisma.order.updateMany({
          where: {
            paymentIntentId: paymentIntent.id,
          },
          data: {
            status: 'failed',
          },
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
