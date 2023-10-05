import { Request } from 'express';
import { Multer } from 'multer';

declare module 'express' {
    interface Request {
        newName: string;
    }
}

declare module 'express' {
	interface Request {
	  file: Multer.File;
	}
  }