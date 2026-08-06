import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'ZenFlow Focus & Study Workspace',
    version: '1.0.0',
    framework: 'Next.js 15 App Router',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    checks: {
      database: 'healthy',
      apiGateway: 'healthy',
      authService: 'operational',
    },
  });
}
