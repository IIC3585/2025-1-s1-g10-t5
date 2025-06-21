import { defineCollection, z } from 'astro:content';

const canciones = defineCollection({
  schema: z.object({
    id: z.string(),
    name: z.string(),
    artist: z.string(),
    image: z.string(),
    preview_url: z.string().nullable(),
  }),
});

export const collections = {
  canciones,
};
