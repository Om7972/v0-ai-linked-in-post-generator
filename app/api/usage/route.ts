/**
 * Usage API
 * Get current usage stats and limits
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { UsageService } from '@/lib/services/usage-service';

export async function GET(req: NextRequest) {
  const supabase = createServerSupabaseClient();

  try {
    // Authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get usage stats
    const stats = await UsageService.getUsageStats(user.id);

    // Check if can generate
    const limitCheck = await UsageService.checkLimit(user.id);

    return NextResponse.json({
      ...stats,
      canGenerate: limitCheck.can_generate,
      reason: limitCheck.reason,
    });

  } catch (error: any) {
    console.error('Error getting usage:', error);
    return NextResponse.json(
      { error: 'Failed to get usage', message: error.message },
      { status: 500 }
    );
  }
}
