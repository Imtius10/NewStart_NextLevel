import Stripe from "stripe";
import {
    PaymentStatus,
    Prisma,
    RentalStatus,
} from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
);


const createPayment = async (
  rentalRequestId: string,
  tenantId: string
) => {
  
  const paymentData = await prisma.$transaction(
    async (tx:Prisma.TransactionClient) => {
     
      const rentalRequest =
        await tx.rentalRequest.findUnique({
          where: {
            id: rentalRequestId,
          },
          include: {
            property: {
              select: {
                id: true,
                title: true,
                description: true,
                price: true,
                location: true,
              },
            },
            payment: true,
          },
        });

      if (!rentalRequest) {
        throw new Error(
          "Rental request not found"
        );
      }

     
      if (
        rentalRequest.tenantId !== tenantId
      ) {
        throw new Error(
          "You are not allowed to pay for this rental request"
        );
      }

     
      if (
        rentalRequest.status !==
        RentalStatus.APPROVED
      ) {
        throw new Error(
          "Payment is only available for approved rental requests"
        );
      }

     
      if (
        rentalRequest.payment?.status ===
        PaymentStatus.PAID
      ) {
        throw new Error(
          "This rental request has already been paid"
        );
      }

      const amount =
        rentalRequest.property.price;

      if (!amount || amount <= 0) {
        throw new Error(
          "Invalid payment amount"
        );
      }

      /**
       * Create or update local payment.
       *
       * Database operation is inside transaction.
       */
      const payment =
        await tx.payment.upsert({
          where: {
            rentalRequestId,
          },

          update: {
            amount,
            tenantId,
            status: PaymentStatus.PENDING,
          },

          create: {
            rentalRequestId,
            tenantId,
            amount,
            status: PaymentStatus.PENDING,
          },
        });

      /**
       * Return only the data needed
       * after transaction commits.
       */
      return {
        payment,
        property: rentalRequest.property,
      };
    }
  );

 
  const stripeAmount = Math.round(
    paymentData.property.price * 100
  );

  /**
   * Create Stripe Checkout Session
   */
  const session =
    await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "bdt",

            product_data: {
              name:
                paymentData.property.title,

              description:
                paymentData.property
                  .description,
            },

            /**
             * Stripe uses the smallest
             * currency unit.
             *
             * 25,000 BDT
             * = 2,500,000 poisha
             */
            unit_amount: stripeAmount,
          },

          quantity: 1,
        },
      ],

      /**
       * Metadata connects Stripe payment
       * with our database.
       */
      metadata: {
        paymentId:
          paymentData.payment.id,

        rentalRequestId,

        tenantId,
      },

      success_url:
        `${process.env.FRONTEND_URL}/payment/success` +
        "?session_id={CHECKOUT_SESSION_ID}",

      cancel_url:
        `${process.env.FRONTEND_URL}/payment/cancel`,
    });

  /**
   * Return checkout information
   */
  return {
    payment: paymentData.payment,

    checkoutUrl: session.url,

    sessionId: session.id,
  };
};


const getMyPayments = async (
  tenantId: string,
  page: number = 1,
  limit: number = 10
) => {
  const pageNum = Math.max(1, page);
  const limitNum = Math.min(50, Math.max(1, limit));
  const skip = (pageNum - 1) * limitNum;

  const [data, total] = await Promise.all([
    prisma.payment.findMany({
      where: {
        tenantId,
      },
      include: {
        rentalRequest: {
          include: {
            property: {
              select: {
                id: true,
                title: true,
                location: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limitNum,
    }),
    prisma.payment.count({
      where: { tenantId },
    }),
  ]);

  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
    },
  };
};


const getPaymentById = async (
  paymentId: string,
  tenantId: string
) => {
  const payment =
    await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },

      include: {
        rentalRequest: {
          include: {
            property: true,
          },
        },
      },
    });

  if (!payment) {
    throw new Error("Payment not found");
  }

  /**
   * Tenant can only see their own payment.
   */
  if (
    payment.tenantId !== tenantId
  ) {
    throw new Error(
      "You are not allowed to view this payment"
    );
  }

  return payment;
};


const handleStripeWebhook = async (
  event: Stripe.Event
) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session =
        event.data.object as Stripe.Checkout.Session;

      const paymentId =
        session.metadata?.paymentId;

      const rentalRequestId =
        session.metadata?.rentalRequestId;

      const tenantId =
        session.metadata?.tenantId;

      if (
        !paymentId ||
        !rentalRequestId ||
        !tenantId
      ) {
        throw new Error(
          "Stripe payment metadata is missing"
        );
      }

      if (
        session.payment_status !== "paid"
      ) {
        return;
      }

      const transactionId =
        typeof session.payment_intent ===
        "string"
          ? session.payment_intent
          : null;

      await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const payment =
            await tx.payment.findUnique({
              where: { id: paymentId },
            });

          if (!payment) {
            throw new Error(
              "Payment record not found"
            );
          }

          if (
            payment.rentalRequestId !==
            rentalRequestId
          ) {
            throw new Error(
              "Payment rental request mismatch"
            );
          }

          if (
            payment.tenantId !== tenantId
          ) {
            throw new Error(
              "Payment tenant mismatch"
            );
          }

          if (
            payment.status ===
            PaymentStatus.PAID
          ) {
            return;
          }

          await tx.payment.update({
            where: { id: paymentId },
            data: {
              status: PaymentStatus.PAID,
              transactionId,
            },
          });
        }
      );

      break;
    }

    case "checkout.session.expired": {
      const session =
        event.data.object as Stripe.Checkout.Session;

      const paymentId =
        session.metadata?.paymentId;

      if (!paymentId) {
        return;
      }

      await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const payment =
            await tx.payment.findUnique({
              where: { id: paymentId },
            });

          if (!payment) {
            return;
          }

          if (
            payment.status ===
            PaymentStatus.PAID
          ) {
            return;
          }

          await tx.payment.update({
            where: { id: paymentId },
            data: {
              status: PaymentStatus.CANCELLED,
            },
          });
        }
      );

      break;
    }

    default:
      break;
  }
};

/**
 * DEV: Trigger Stripe webhook and save transactionId
 */
const testConfirmPayment = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      rentalRequest: {
        select: { id: true, status: true },
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === PaymentStatus.PAID) {
    throw new Error("Payment already confirmed");
  }

  if (payment.rentalRequest.status !== RentalStatus.APPROVED) {
    throw new Error("Rental request must be APPROVED before payment");
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: PaymentStatus.PAID,
      transactionId: `dev_pi_${Date.now()}`,
    },
  });

  return updatedPayment;
};

export const paymentService = {
    createPayment,
    getMyPayments,
    getPaymentById,
    handleStripeWebhook,
    testConfirmPayment
};