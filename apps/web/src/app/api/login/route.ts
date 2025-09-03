import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Define the URL of your Python backend's identify endpoint
  const backendUrl = 'http://localhost:8000/login';

  try {
    const formData = await request.formData();

    // Forward the FormData to the Python backend
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      body: formData,
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend responded with status: ${backendResponse.status}`);
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to connect to the backend service.' },
      { status: 502 }
    );
  }
}
