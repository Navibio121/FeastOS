import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { items, locationId, address, phone } = await req.json();

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image].filter(Boolean),
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/checkout`,
      customer_email: session.user.email as string,
      metadata: {
        userId: session.user.id,
        locationId,
        address,
        phone,
        items: JSON.stringify(items.map((i: any) => ({ id: i.id, quantity: i.quantity }))),
      },
    });

    return NextResponse.json({ id: stripeSession.id });
  } catch (error: any) {
    console.error('STRIPE_SESSION_ERROR', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
