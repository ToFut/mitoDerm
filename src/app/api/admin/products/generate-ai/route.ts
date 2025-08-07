import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Admin users list
const adminUsers = [
  'admin@mitoderm.com',
  'shiri@mitoderm.com',
  'segev@futurixs.com',
  'ilona@mitoderm.co.il'
];

export async function POST(request: NextRequest) {
  try {
    const session = await auth() as any;
    
    if (!session?.user?.email || !adminUsers.includes(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, productTitle } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Mock AI generation - in production, this would call OpenAI or another AI service
    const aiResponse = await generateAIContent(prompt, productTitle);

    return NextResponse.json({
      success: true,
      ...aiResponse
    });
  } catch (error) {
    console.error('Error generating AI content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateAIContent(prompt: string, productTitle: string) {
  // Mock AI generation - replace with actual AI service call
  const enhancedPrompt = `Generate content for a medical aesthetic product called "${productTitle}". 
  User request: ${prompt}
  
  Please provide:
  1. A detailed product description
  2. Key features (as a list)
  3. Technical specifications (as key-value pairs)
  4. Benefits (as a list with titles and descriptions)
  5. AI-generated insights (as HTML content)
  
  Focus on medical aesthetics, professional grade, and advanced technology.`;

  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock response based on the prompt
  const description = `${productTitle} represents a breakthrough in medical aesthetics, combining advanced technology with professional-grade formulations. This innovative product delivers exceptional results through cutting-edge science and precision engineering, making it the preferred choice for medical aesthetic professionals worldwide.`;

  const features = [
    'Advanced medical-grade technology',
    'Professional aesthetic formulation',
    'Clinically proven results',
    'Superior patient outcomes',
    'Innovative delivery system'
  ];

  const specifications = {
    'Technology': 'Advanced medical aesthetic technology',
    'Application': 'Professional medical aesthetic treatments',
    'Grade': 'Medical professional grade',
    'Results': 'Clinically proven outcomes',
    'Safety': 'FDA compliant and tested'
  };

  const benefits = [
    {
      title: 'Superior Results',
      description: 'Delivers exceptional outcomes through advanced technology and professional-grade formulations.'
    },
    {
      title: 'Professional Grade',
      description: 'Medical-grade quality ensures safety and efficacy for professional aesthetic treatments.'
    },
    {
      title: 'Innovative Technology',
      description: 'Cutting-edge technology provides superior performance and patient satisfaction.'
    }
  ];

  const aiContent = `
    <h3>AI-Generated Insights for ${productTitle}</h3>
    <p>Our advanced AI analysis of ${productTitle} reveals exceptional potential in the medical aesthetics market. This product demonstrates superior efficacy through innovative technology and professional-grade formulation.</p>
    
    <h4>Key Advantages Identified:</h4>
    <ul>
      <li>Advanced technology integration for optimal results</li>
      <li>Professional-grade formulation for medical use</li>
      <li>Superior patient outcomes and satisfaction</li>
      <li>Innovative delivery system for enhanced efficacy</li>
    </ul>
    
    <h4>Market Analysis:</h4>
    <p>${productTitle} positions itself as a premium solution in the medical aesthetics industry, offering cutting-edge technology combined with proven clinical results. The product's advanced formulation and professional-grade quality make it an ideal choice for medical aesthetic professionals seeking superior patient outcomes.</p>
  `;

  return {
    description,
    features: features.join('\n'),
    specifications: Object.entries(specifications).map(([k, v]) => `${k}: ${v}`).join('\n'),
    benefits,
    aiContent
  };
} 