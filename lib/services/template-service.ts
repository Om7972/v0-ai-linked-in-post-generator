/**
 * Template Service
 * Manages prompt templates for different roles
 */

import { createServerSupabaseClient } from '../supabase';
import type { PromptTemplate, TemplateRole } from '@/types/database';

export class TemplateService {
    /**
     * Get all active templates
     */
    static async getActiveTemplates(): Promise<PromptTemplate[]> {
        const supabase = createServerSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('prompt_templates')
                .select('*')
                .eq('is_active', true)
                .order('role', { ascending: true });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error getting templates:', error);
            throw new Error('Failed to get templates');
        }
    }

    /**
     * Get templates by role
     */
    static async getTemplatesByRole(role: TemplateRole): Promise<PromptTemplate[]> {
        const supabase = createServerSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('prompt_templates')
                .select('*')
                .eq('role', role)
                .eq('is_active', true)
                .order('is_default', { ascending: false });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error getting templates by role:', error);
            throw new Error('Failed to get templates');
        }
    }

    /**
     * Get default template for a role
     */
    static async getDefaultTemplate(role: TemplateRole): Promise<PromptTemplate | null> {
        const supabase = createServerSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('prompt_templates')
                .select('*')
                .eq('role', role)
                .eq('is_active', true)
                .eq('is_default', true)
                .single();

            if (error) {
                // If no default found, get the first active template for this role
                const { data: fallback, error: fallbackError } = await supabase
                    .from('prompt_templates')
                    .select('*')
                    .eq('role', role)
                    .eq('is_active', true)
                    .limit(1)
                    .single();

                if (fallbackError) return null;
                return fallback;
            }

            return data;
        } catch (error) {
            console.error('Error getting default template:', error);
            return null;
        }
    }

    /**
     * Get template by ID
     */
    static async getTemplateById(templateId: string): Promise<PromptTemplate | null> {
        const supabase = createServerSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('prompt_templates')
                .select('*')
                .eq('id', templateId)
                .single();

            if (error) return null;

            return data;
        } catch (error) {
            console.error('Error getting template by ID:', error);
            return null;
        }
    }

    /**
     * Create custom template for user
     */
    static async createCustomTemplate(
        userId: string,
        template: {
            name: string;
            description?: string;
            systemPrompt: string;
            userPromptTemplate: string;
        }
    ): Promise<PromptTemplate> {
        const supabase = createServerSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('prompt_templates')
                .insert({
                    role: 'custom',
                    name: template.name,
                    description: template.description || null,
                    system_prompt: template.systemPrompt,
                    user_prompt_template: template.userPromptTemplate,
                    is_active: true,
                    is_default: false,
                    created_by: userId,
                })
                .select()
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Error creating custom template:', error);
            throw new Error('Failed to create template');
        }
    }

    /**
     * Get user's custom templates
     */
    static async getUserTemplates(userId: string): Promise<PromptTemplate[]> {
        const supabase = createServerSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('prompt_templates')
                .select('*')
                .eq('created_by', userId)
                .eq('role', 'custom')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error getting user templates:', error);
            throw new Error('Failed to get user templates');
        }
    }

    /**
     * Update custom template
     */
    static async updateTemplate(
        templateId: string,
        userId: string,
        updates: {
            name?: string;
            description?: string;
            systemPrompt?: string;
            userPromptTemplate?: string;
            isActive?: boolean;
        }
    ): Promise<PromptTemplate> {
        const supabase = createServerSupabaseClient();

        try {
            const updateData: any = {};
            if (updates.name) updateData.name = updates.name;
            if (updates.description !== undefined) updateData.description = updates.description;
            if (updates.systemPrompt) updateData.system_prompt = updates.systemPrompt;
            if (updates.userPromptTemplate) updateData.user_prompt_template = updates.userPromptTemplate;
            if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

            const { data, error } = await supabase
                .from('prompt_templates')
                .update(updateData)
                .eq('id', templateId)
                .eq('created_by', userId)
                .eq('role', 'custom')
                .select()
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Error updating template:', error);
            throw new Error('Failed to update template');
        }
    }

    /**
     * Delete custom template
     */
    static async deleteTemplate(templateId: string, userId: string): Promise<void> {
        const supabase = createServerSupabaseClient();

        try {
            const { error } = await supabase
                .from('prompt_templates')
                .delete()
                .eq('id', templateId)
                .eq('created_by', userId)
                .eq('role', 'custom');

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting template:', error);
            throw new Error('Failed to delete template');
        }
    }

    /**
     * Render template with variables
     */
    static renderTemplate(
        template: string,
        variables: Record<string, string>
    ): string {
        let rendered = template;

        for (const [key, value] of Object.entries(variables)) {
            const placeholder = `{{${key}}}`;
            rendered = rendered.replace(new RegExp(placeholder, 'g'), value);
        }

        return rendered;
    }
}
