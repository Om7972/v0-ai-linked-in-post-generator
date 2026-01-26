/**
 * Plans API
 * Get available subscription plans
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
    const supabase = createServerSupabaseClient();

    try {
        // Get all plans (public data)
        const { data: plans, error } = await supabase
            .from('plans')
            .select('*')
            .order('price_monthly', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ plans: plans || [] });

    } catch (error: any) {
        console.error('Error getting plans:', error);
        return NextResponse.json(
            { error: 'Failed to get plans', message: error.message },
            { status: 500 }
        );
    }
}
