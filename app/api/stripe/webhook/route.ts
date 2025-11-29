import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          await supabase
            .from('subscriptions')
            .update({
              tier: 'pro',
              stripe_subscription_id: subscription.id,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              status: subscription.status === 'active' ? 'active' : 'trialing',
            })
            .eq('user_id', userId)

          await supabase.from('subscription_logs').insert({
            user_id: userId,
            event_type: 'subscription_created',
            to_tier: 'pro',
            amount: subscription.items.data[0]?.price.unit_amount
              ? subscription.items.data[0].price.unit_amount / 100
              : null,
          })
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: subData } = await supabase
          .from('subscriptions')
          .select('user_id, tier')
          .eq('stripe_customer_id', customerId)
          .single()

        if (subData) {
          const newTier = subscription.status === 'active' ? 'pro' : 'free'
          const eventType =
            subscription.status === 'active' ? 'upgraded' : 'canceled'

          await supabase
            .from('subscriptions')
            .update({
              tier: newTier,
              status: subscription.status === 'active' ? 'active' : 'canceled',
              current_period_start: new Date(
                subscription.current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq('user_id', subData.user_id)

          await supabase.from('subscription_logs').insert({
            user_id: subData.user_id,
            event_type: eventType,
            from_tier: subData.tier,
            to_tier: newTier,
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: subData } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (subData) {
          await supabase.from('subscription_logs').insert({
            user_id: subData.user_id,
            event_type: 'payment_failed',
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

