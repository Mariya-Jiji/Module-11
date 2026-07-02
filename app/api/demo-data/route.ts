import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Randomly fail sometimes to demonstrate error states
  if (Math.random() < 0.2) {
    return NextResponse.json(
      { error: 'Failed to fetch demo data. This is a simulated error.' },
      { status: 500 }
    );
  }

  const demoData = [
    { id: 1, name: 'Quantum Core Model', status: 'Active', latency: '42ms' },
    { id: 2, name: 'Neural Nexus', status: 'Training', latency: 'N/A' },
    { id: 3, name: 'Language Engine v5', status: 'Idle', latency: '12ms' },
    { id: 4, name: 'Vision Processor', status: 'Active', latency: '89ms' },
  ];

  return NextResponse.json(demoData);
}
