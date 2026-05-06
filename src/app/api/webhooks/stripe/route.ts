import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendOrderEmail } from '@/lib/mail';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook Signature Error: ${error.message}`);
    return NextResponse.json({ message: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const metadata = session.metadata;

    if (!metadata || !metadata.items) {
      console.error('Webhook missing metadata');
      return NextResponse.json({ message: 'Missing metadata' }, { status: 400 });
    }

    try {
      const cartItems = JSON.parse(metadata.items);
      const productIds = cartItems.map((item: any) => item.id);

      // Fetch actual menu items to ensure price/name integrity
      const menuItems = await prisma.menuItem.findMany({
        where: { id: { in: productIds } }
      });

      // Create the order in the database
      const order = await prisma.order.create({
        data: {
          userId: metadata.userId,
          locationId: metadata.locationId,
          address: metadata.address,
          phone: metadata.phone,
          total: session.amount_total / 100,
          status: 'PENDING',
          items: {
            create: cartItems.map((cartItem: any) => {
              const menuItem = menuItems.find(m => m.id === cartItem.id);
              return {
                productId: cartItem.id,
                name: menuItem?.name || 'Unknown Dish',
                price: menuItem?.price || 0,
                quantity: cartItem.quantity,
                image: menuItem?.image
              };
            }),
          },
        },
        include: {
          items: true
        }
      });

      // Send Confirmation Email
      await sendOrderEmail(session.customer_email || '', order);
      
      console.log(`Order ${order.id} created successfully via Webhook.`);
    } catch (dbError: any) {
      console.error('DATABASE_ORDER_CREATION_ERROR', dbError);
      // Even if email fails, we return 200 to Stripe to avoid retries if the order was created
    }
  }

  return NextResponse.json({ received: true });
}

