import mongoose from 'mongoose';

export interface PostCreateDto {
  owner: mongoose.ObjectId;
  description?: string;
  content: string[];
}
