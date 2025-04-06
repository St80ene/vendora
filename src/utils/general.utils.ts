import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export const createDefaultDirs = () => {
  // Check if the environment is 'development' and the file driver is 'local'
  const isDevelopment = process.env.NODE_ENV === 'development';
  const fileDriver = process.env.FILE_DRIVER; // Assuming you have this in your .env or config

  if (isDevelopment && fileDriver === 'local') {
    // Directories to create in the project root (outside dist folder)
    const dirs = ['public', 'public/shipping', 'public/users/avatars'];

    dirs.forEach((dir) => {
      // Resolve the full path to the project root, even when running from dist
      const fullPath = resolve(process.cwd(), dir); // Will resolve the root path for both dev and prod environments

      // Check if the directory doesn't exist, and create it along with parent directories
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
        console.log(`Created directory: ${fullPath}`);
      } else {
        console.log(`Directory already exists: ${fullPath}`);
      }
    });
  } else {
    console.log(
      'Not in development or file driver is not local. Skipping directory creation.'
    );
  }
};

// Helper function to validate URLs
export const isValidUrl = (url: string): boolean => {
  const regex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9]{2,4}(\/[^\s]*)?$/i;
  return regex.test(url);
};
