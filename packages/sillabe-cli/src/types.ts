import { z } from 'zod';

export const ConfigurationSchema = z.object({
    content: z.string().nonempty(),
    build: z.string().nonempty(),
    views: z.string().nonempty(),
    templateEngine: z.string().nonempty(),
    plugins: z.any().array(),
});

export type Configuration = z.infer<typeof ConfigurationSchema>;
