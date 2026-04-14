import { z } from 'zod';

export const schema = z.object({
  title: z.string().min(1),
  link: z
    .string()
    .regex(
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{2,24}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
      '올바른 URL 형식을 입력해주세요',
    )
    .optional()
    .or(z.literal('')),
});

export type FormValues = z.infer<typeof schema>;
