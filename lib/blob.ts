import { put, del } from '@vercel/blob';

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error('BLOB_READ_WRITE_TOKEN is not defined');
}

export async function uploadFile(
  file: File,
  folder: string = 'uploads'
): Promise<{ url: string; filename: string }> {
  try {
    const timestamp = Date.now();
    const filename = `${folder}/${timestamp}-${file.name}`;

    const blob = await put(filename, file, {
      access: 'public',
    });

    return {
      url: blob.url,
      filename: blob.pathname,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function uploadCustomDesignImage(
  file: File,
  designId: string
): Promise<{ url: string; filename: string }> {
  try {
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `custom-designs/${designId}/${timestamp}.${ext}`;

    const blob = await put(filename, file, {
      access: 'public',
    });

    return {
      url: blob.url,
      filename: blob.pathname,
    };
  } catch (error) {
    console.error('Error uploading custom design image:', error);
    throw error;
  }
}

export async function uploadProductImage(
  file: File,
  productId: string
): Promise<{ url: string; filename: string }> {
  try {
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `products/${productId}/${timestamp}.${ext}`;

    const blob = await put(filename, file, {
      access: 'public',
    });

    return {
      url: blob.url,
      filename: blob.pathname,
    };
  } catch (error) {
    console.error('Error uploading product image:', error);
    throw error;
  }
}

export async function deleteFile(filename: string): Promise<void> {
  try {
    await del(filename);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}
