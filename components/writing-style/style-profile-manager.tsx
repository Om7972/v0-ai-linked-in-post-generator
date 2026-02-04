'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sparkles, MoreVertical, Check, Trash2, Eye, EyeOff } from 'lucide-react';
import { StyleOnboardingModal } from './style-onboarding-modal';

interface StyleProfile {
    id: string;
    name: string;
    is_active: boolean;
    is_default: boolean;
    style_summary: string | null;
    sample_count: number;
    created_at: string;
}

export function StyleProfileManager() {
    const [profiles, setProfiles] = useState<StyleProfile[]>([]);
    const [defaultProfile, setDefaultProfile] = useState<StyleProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        try {
            const response = await fetch('/api/writing-style');
            if (response.ok) {
                const data = await response.json();
                setProfiles(data.profiles || []);
                setDefaultProfile(data.defaultProfile);
            }
        } catch (error) {
            console.error('Error loading profiles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetDefault = async (profileId: string) => {
        try {
            const response = await fetch('/api/writing-style', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profileId,
                    action: 'setDefault',
                }),
            });

            if (response.ok) {
                await loadProfiles();
            }
        } catch (error) {
            console.error('Error setting default:', error);
        }
    };

    const handleToggleActive = async (profileId: string, isActive: boolean) => {
        try {
            const response = await fetch('/api/writing-style', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profileId,
                    action: 'toggleActive',
                    value: !isActive,
                }),
            });

            if (response.ok) {
                await loadProfiles();
            }
        } catch (error) {
            console.error('Error toggling active:', error);
        }
    };

    const handleDelete = async (profileId: string) => {
        if (!confirm('Are you sure you want to delete this style profile?')) {
            return;
        }

        try {
            const response = await fetch(`/api/writing-style?profileId=${profileId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await loadProfiles();
            }
        } catch (error) {
            console.error('Error deleting profile:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-indigo-500" />
                        Personal Writing Styles
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Train AI on your unique voice for authentic content
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-500 hover:bg-indigo-600">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create New Style
                </Button>
            </div>

            {/* Profiles Grid */}
            {profiles.length === 0 ? (
                <Card className="p-12 text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Writing Styles Yet</h3>
                    <p className="text-muted-foreground mb-6">
                        Create your first style profile by pasting 3-5 of your LinkedIn posts
                    </p>
                    <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-500 hover:bg-indigo-600">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get Started
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profiles.map((profile) => (
                        <Card key={profile.id} className="p-6 relative group hover:shadow-lg transition-shadow">
                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-4">
                                {profile.is_default && (
                                    <Badge className="bg-indigo-500">Default</Badge>
                                )}
                                {profile.is_active ? (
                                    <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                                        <Eye className="w-3 h-3 mr-1" />
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
                                        <EyeOff className="w-3 h-3 mr-1" />
                                        Inactive
                                    </Badge>
                                )}
                            </div>

                            {/* Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {!profile.is_default && (
                                        <DropdownMenuItem onClick={() => handleSetDefault(profile.id)}>
                                            <Check className="w-4 h-4 mr-2" />
                                            Set as Default
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => handleToggleActive(profile.id, profile.is_active)}>
                                        {profile.is_active ? (
                                            <>
                                                <EyeOff className="w-4 h-4 mr-2" />
                                                Deactivate
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-4 h-4 mr-2" />
                                                Activate
                                            </>
                                        )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleDelete(profile.id)}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Content */}
                            <h3 className="text-lg font-semibold mb-2">{profile.name}</h3>

                            {profile.style_summary && (
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                    {profile.style_summary}
                                </p>
                            )}

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{profile.sample_count} sample posts</span>
                                <span>•</span>
                                <span>{new Date(profile.created_at).toLocaleDateString()}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Onboarding Modal */}
            <StyleOnboardingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadProfiles}
            />
        </div>
    );
}
