import { Request, Response } from "express";
import Stripe from "stripe";

import { paymentService } from "./payment.Service";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
);

const stripeWebhook = async (
  req: Request,
  res: Response
) => {
  const signature =
    req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({
      success: false,
      message: "Stripe signature missing",
    });
  }

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "STRIPE_WEBHOOK_SECRET is not configured"
    );

    return res.status(500).json({
      success: false,
      message:
        "Stripe webhook secret is not configured",
    });
  }

  try {
    /**
     * req.body must be the raw Buffer.
     */
    const event =
      stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );

    await paymentService.handleStripeWebhook(
      event
    );

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Stripe webhook error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        "Webhook verification failed",
    });
  }
};

export const paymentWebhookController = {
  stripeWebhook,
};