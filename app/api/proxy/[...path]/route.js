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
    if (contentType) {
      headers.set('content-type', contentType);
    }
    headers.set('Accept', 'application/json, */*');

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
      headers: contentType && contentType.includes('multipart/form-data') ? undefined : headers,
      body,
      cache: 'no-store'
    });

    const data = await response.text();
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
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
