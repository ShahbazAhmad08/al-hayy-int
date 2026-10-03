import { NextResponse } from 'next/server';

const REMOTE_BASE_URL = 'http://alhayyinternational-com.stackstaging.com/v2/api';

async function handleProxy(request, { params }) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams?.path || [];
    const subPath = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments;
    
    const { search } = new URL(request.url);
    const targetUrl = `${REMOTE_BASE_URL}/${subPath}${search}`;

    const headers = new Headers();
    const contentType = request.headers.get('content-type');
    if (contentType && !contentType.includes('multipart/form-data')) {
      headers.set('content-type', contentType);
    }
    headers.set('Accept', 'application/json, */*');
    const userAgent = request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    headers.set('User-Agent', userAgent);

    const method = request.method;
    let body = undefined;

    if (method !== 'GET' && method !== 'HEAD') {
      if (contentType && contentType.includes('application/json')) {
        body = await request.text();
      } else if (contentType && contentType.includes('multipart/form-data')) {
        body = await request.formData();
      } else {
        body = await request.arrayBuffer();
      }
    }

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: 'no-store'
    });

    const contentTypeHeader = response.headers.get('content-type') || '';
    const isBinary = contentTypeHeader.startsWith('image/') || 
                     contentTypeHeader.startsWith('video/') || 
                     contentTypeHeader.startsWith('audio/') || 
                     contentTypeHeader.includes('octet-stream');

    const resHeaders = {
      'Content-Type': contentTypeHeader || 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (isBinary) {
      resHeaders['Cache-Control'] = 'public, max-age=31536000, immutable';
      const arrayBuffer = await response.arrayBuffer();
      return new NextResponse(Buffer.from(arrayBuffer), {
        status: response.status,
        headers: resHeaders
      });
    }

    const data = await response.text();
    
    return new NextResponse(data, {
      status: response.status,
      headers: resHeaders
    });
  } catch (error) {
    console.error('API Proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Proxy request failed: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request, context) {
  return handleProxy(request, context);
}

export async function POST(request, context) {
  return handleProxy(request, context);
}

export async function PUT(request, context) {
  return handleProxy(request, context);
}

export async function DELETE(request, context) {
  return handleProxy(request, context);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
