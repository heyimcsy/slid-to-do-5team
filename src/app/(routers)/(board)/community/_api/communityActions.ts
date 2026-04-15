'use server';

import { updateTag } from 'next/cache';

import { communityTags } from './communityQueryKeys';

export async function updatePosts(): Promise<void> {
  updateTag(communityTags.posts);
  updateTag(communityTags.bestPosts);
}

export async function updatePost(postId: number): Promise<void> {
  updateTag(communityTags.post(postId));
}

export async function updateComments(postId: number): Promise<void> {
  updateTag(communityTags.comments(postId));
}
