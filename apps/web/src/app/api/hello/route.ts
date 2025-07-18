import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Define the URL of your Python backend
  const backendUrl = 'http://localhost:8000';

  try {
    // Fetch data from the Python backend
    const backendResponse = await fetch(backendUrl);

    // Check if the backend responded successfully
    if (!backendResponse.ok) {
      throw new Error(
        `Backend responded with status: ${backendResponse.status}`
      );
    }

    // Assuming the backend returns JSON, parse it
    const data = await backendResponse.json();

    // Return the data from the backend to the original caller
    return NextResponse.json(data);
  } catch (error) {
    // Log the error for debugging on the server
    console.error(error);

    // Return an error response to the client
    return NextResponse.json(
      { error: 'Failed to connect to the backend service.' },
      { status: 502 } // 502 Bad Gateway is appropriate here
    );
  }
}
