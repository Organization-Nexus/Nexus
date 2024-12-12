import { Express } from 'express';

export interface CustomFile extends Express.Multer.File {
  fileType: string;
}
