import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { uploadCustomDesignImage } from '@/lib/blob';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendCustomDesignNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create custom design record
    const customDesign = await prisma.customDesign.create({
      data: {
        userId: session.user.id,
        description,
        status: 'pending',
      },
    });

    // Upload file
    const { url, filename } = await uploadCustomDesignImage(file, customDesign.id);

    // Update design with image URL
    const updatedDesign = await prisma.customDesign.update({
      where: { id: customDesign.id },
      data: {
        imageUrl: url,
      },
      include: {
        user: true,
      },
    });

    // Send notification email
    await sendCustomDesignNotification(
      updatedDesign.user.email || '',
      updatedDesign.user.name || 'Valued Customer',
      description
    );

    return NextResponse.json({
      id: updatedDesign.id,
      url,
      filename,
      status: updatedDesign.status,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
