import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import {
  PaymentStatus,
  RentalStatus,
  Prisma,
} from "../../../generated/prisma/client";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
);


const createPayment = async (
  rentalRequestId: string,
  tenantId: string
) => {
  
  const paymentData = await prisma.$transaction(
    async (tx:Prisma.TransactionClien) => {
     
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
  tenantId: string
) => {
  return prisma.payment.findMany({
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
  });
};

/**
 * ============================================================
 * GET PAYMENT BY ID
 * ============================================================
 */


export const paymentService = {
    createPayment,
    getMyPayments,
  
};