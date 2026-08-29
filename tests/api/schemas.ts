import { z } from 'zod';

export const postSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
});
export const postsSchema = z.array(postSchema);
export type Post = z.infer<typeof postSchema>;

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.email(),
});
export const usersSchema = z.array(userSchema);
export type User = z.infer<typeof userSchema>;

export const commentSchema = z.object({
  id: z.number(),
  postId: z.number(),
  name: z.string(),
  email: z.email(),
  body: z.string(),
});
export const commentsSchema = z.array(commentSchema);
export type Comment = z.infer<typeof commentSchema>;
