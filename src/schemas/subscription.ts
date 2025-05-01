import { Category, Currency, Frequency } from '@prisma/client';
import dayjs from 'dayjs';
import { z } from 'zod';

export const CreateSubscriptionSchema = z
  .object({
    name: z.string().nonempty({ message: 'Name is required' }),

    price: z
      .number({ invalid_type_error: 'Price must be a number' })
      .positive({ message: 'Price must be greater than zero' }),

    currency: z.nativeEnum(Currency, {
      errorMap: () => ({ message: 'Currency must be one of USD, EUR, …' }),
    }),

    frequency: z
      .nativeEnum(Frequency, {
        errorMap: () => ({
          message: 'Frequency must be one of your enum values',
        }),
      })
      .optional(),

    category: z.nativeEnum(Category, {
      errorMap: () => ({ message: 'Category must be one of your enum values' }),
    }),

    paymentMethod: z
      .string()
      .nonempty({ message: 'Payment method is required' }),

    startDate: z
      .string({ invalid_type_error: 'startDate must be a string (ISO date)' })
      .refine((s) => dayjs(s).isValid(), {
        message: 'startDate must be a valid ISO date',
      })
      .refine((s) => dayjs(s).isAfter(dayjs(), 'day'), {
        message: 'startDate must be in the future',
      }),

    renewalDate: z
      .string({ invalid_type_error: 'renewalDate must be a string (ISO date)' })
      .optional()
      .refine((s) => (s ? dayjs(s).isValid() : true), {
        message: 'renewalDate must be a valid ISO date',
      }),
  })
  .superRefine((data, ctx) => {
    if (data.renewalDate) {
      const start = dayjs(data.startDate);
      const renewal = dayjs(data.renewalDate);
      if (renewal.isBefore(start, 'day')) {
        ctx.addIssue({
          path: ['renewalDate'],
          message: 'renewalDate must be on or after startDate',
          code: 'custom',
        });
      }
    }
  });

export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;
