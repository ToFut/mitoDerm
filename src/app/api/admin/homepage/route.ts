import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function GET() {
  try {
    // Get session to verify admin access
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get homepage content from Firebase
    const homepageRef = doc(db, 'homepage', 'content');
    const homepageDoc = await getDoc(homepageRef);

    if (!homepageDoc.exists()) {
      // Return default content if none exists
      const defaultContent = {
        heroSection: {
          title: {
            en: 'Revolutionary Skincare Solutions',
            he: 'פתרונות טיפוח עור מהפכניים',
            ru: 'Революционные решения по уходу за кожей'
          },
          subtitle: {
            en: 'Experience the future of aesthetic medicine with our advanced exosome technology',
            he: 'חווה את עתיד הרפואה האסתטית עם טכנולוגיית האקסוזומים המתקדמת שלנו',
            ru: 'Ощутите будущее эстетической медицины с нашей передовой технологией экзосом'
          },
          backgroundVideo: '/videos/eventIntroVideo.webm',
          backgroundImage: '/images/introBG.png',
          ctaButton: {
            en: 'Explore Products',
            he: 'גלה מוצרים',
            ru: 'Изучить продукты'
          },
          hasSound: true
        },
        sections: [],
        globalSettings: {
          videoQuality: 'high',
          autoplayEnabled: true,
          soundEnabled: true,
          mobileOptimized: true
        },
        lastUpdated: new Date().toISOString(),
        updatedBy: session.user.email
      };

      return NextResponse.json(defaultContent);
    }

    const content = homepageDoc.data();
    return NextResponse.json(content);

  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage content' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get session to verify admin access
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin role check here
    // if (session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    // }

    const content = await request.json();

    // Validate content structure
    if (!content.heroSection || !content.globalSettings) {
      return NextResponse.json(
        { error: 'Invalid content structure' },
        { status: 400 }
      );
    }

    // Add metadata
    const updatedContent = {
      ...content,
      lastUpdated: serverTimestamp(),
      updatedBy: session.user.email,
      version: (content.version || 0) + 1
    };

    // Save to Firebase
    const homepageRef = doc(db, 'homepage', 'content');
    await setDoc(homepageRef, updatedContent, { merge: true });

    // Log the update for audit trail
    const auditRef = collection(db, 'homepage', 'content', 'audit');
    await setDoc(doc(auditRef), {
      action: 'update',
      userId: session.user.email,
      timestamp: serverTimestamp(),
      changes: {
        heroSection: !!content.heroSection,
        sectionsCount: content.sections?.length || 0,
        globalSettings: !!content.globalSettings
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Homepage content updated successfully',
      version: updatedContent.version
    });

  } catch (error) {
    console.error('Error updating homepage content:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Get session to verify admin access
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { field, value } = await request.json();

    // Validate field and value
    if (!field || value === undefined) {
      return NextResponse.json(
        { error: 'Field and value are required' },
        { status: 400 }
      );
    }

    // Update specific field
    const homepageRef = doc(db, 'homepage', 'content');
    await updateDoc(homepageRef, {
      [field]: value,
      lastUpdated: serverTimestamp(),
      updatedBy: session.user.email
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Field updated successfully'
    });

  } catch (error) {
    console.error('Error updating homepage field:', error);
    return NextResponse.json(
      { error: 'Failed to update field' },
      { status: 500 }
    );
  }
}