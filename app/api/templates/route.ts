/**
 * Templates API
 * Manage prompt templates
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { TemplateService } from '@/lib/services/template-service';
import type { CreateTemplateRequest } from '@/types/database';

// GET /api/templates - Get all templates
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

        // Get all active templates
        const templates = await TemplateService.getActiveTemplates();

        // Get user's custom templates
        const userTemplates = await TemplateService.getUserTemplates(user.id);

        return NextResponse.json({
            templates,
            userTemplates,
        });

    } catch (error: any) {
        console.error('Error getting templates:', error);
        return NextResponse.json(
            { error: 'Failed to get templates', message: error.message },
            { status: 500 }
        );
    }
}

// POST /api/templates - Create custom template
export async function POST(req: NextRequest) {
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

        // Parse request
        const body: CreateTemplateRequest = await req.json();
        const { name, description, systemPrompt, userPromptTemplate } = body;

        // Validate
        if (!name || !systemPrompt || !userPromptTemplate) {
            return NextResponse.json(
                { error: 'Missing required fields: name, systemPrompt, userPromptTemplate' },
                { status: 400 }
            );
        }

        // Create template
        const template = await TemplateService.createCustomTemplate(user.id, {
            name,
            description,
            systemPrompt,
            userPromptTemplate,
        });

        return NextResponse.json(template);

    } catch (error: any) {
        console.error('Error creating template:', error);
        return NextResponse.json(
            { error: 'Failed to create template', message: error.message },
            { status: 500 }
        );
    }
}
