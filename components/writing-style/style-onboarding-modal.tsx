'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Sparkles, Plus, Trash2 } from 'lucide-react';

interface StyleOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function StyleOnboardingModal({ isOpen, onClose, onSuccess }: StyleOnboardingModalProps) {
    const [step, setStep] = useState(1);
    const [styleName, setStyleName] = useState('');
    const [samplePosts, setSamplePosts] = useState(['', '', '']);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');

    const addSamplePost = () => {
        if (samplePosts.length < 10) {
            setSamplePosts([...samplePosts, '']);
        }
    };

    const removeSamplePost = (index: number) => {
        if (samplePosts.length > 3) {
            setSamplePosts(samplePosts.filter((_, i) => i !== index));
        }
    };

    const updateSamplePost = (index: number, value: string) => {
        const newPosts = [...samplePosts];
        newPosts[index] = value;
        setSamplePosts(newPosts);
    };

    const handleNext = () => {
        if (step === 1) {
            if (!styleName.trim()) {
                setError('Please enter a name for your writing style');
                return;
            }
            setError('');
            setStep(2);
        }
    };

    const handleAnalyze = async () => {
        // Validate
        const filledPosts = samplePosts.filter(post => post.trim().length > 0);
        if (filledPosts.length < 3) {
            setError('Please provide at least 3 sample posts');
            return;
        }

        setIsAnalyzing(true);
        setError('');

        try {
            const response = await fetch('/api/writing-style', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: styleName,
                    samplePosts: filledPosts,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to analyze writing style');
            }

            const data = await response.json();
            console.log('Style profile created:', data);

            onSuccess();
            onClose();

            // Reset form
            setStep(1);
            setStyleName('');
            setSamplePosts(['', '', '']);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Sparkles className="w-6 h-6 text-indigo-500" />
                        Train Your Personal Writing Style
                    </DialogTitle>
                    <DialogDescription>
                        Paste 3-5 of your best LinkedIn posts and let AI learn your unique voice
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 my-6">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-500' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-500 text-white' : 'bg-muted'}`}>
                            1
                        </div>
                        <span className="text-sm font-medium">Name</span>
                    </div>
                    <div className="w-12 h-0.5 bg-muted" />
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-500' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-500 text-white' : 'bg-muted'}`}>
                            2
                        </div>
                        <span className="text-sm font-medium">Sample Posts</span>
                    </div>
                </div>

                {/* Step 1: Name */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="styleName">Style Profile Name</Label>
                            <Input
                                id="styleName"
                                placeholder="e.g., My Founder Voice, Professional Tone, Casual Style"
                                value={styleName}
                                onChange={(e) => setStyleName(e.target.value)}
                                className="mt-2"
                            />
                            <p className="text-sm text-muted-foreground mt-2">
                                Give your writing style a memorable name
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleNext} className="bg-indigo-500 hover:bg-indigo-600">
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Sample Posts */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                            <p className="text-sm text-indigo-300">
                                💡 <strong>Tip:</strong> Choose your best-performing posts that represent your authentic voice. The AI will analyze tone, sentence structure, emoji usage, and more.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {samplePosts.map((post, index) => (
                                <div key={index} className="relative">
                                    <Label htmlFor={`post-${index}`}>
                                        Sample Post {index + 1} {index < 3 && <span className="text-destructive">*</span>}
                                    </Label>
                                    <div className="relative mt-2">
                                        <Textarea
                                            id={`post-${index}`}
                                            placeholder="Paste your LinkedIn post here..."
                                            value={post}
                                            onChange={(e) => updateSamplePost(index, e.target.value)}
                                            rows={6}
                                            className="pr-10"
                                        />
                                        {index >= 3 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeSamplePost(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {post.split(/\s+/).filter(w => w).length} words
                                    </p>
                                </div>
                            ))}
                        </div>

                        {samplePosts.length < 10 && (
                            <Button
                                variant="outline"
                                onClick={addSamplePost}
                                className="w-full"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Another Post (Optional)
                            </Button>
                        )}

                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-between gap-2">
                            <Button variant="outline" onClick={() => setStep(1)}>
                                Back
                            </Button>
                            <Button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="bg-indigo-500 hover:bg-indigo-600"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Analyzing Your Style...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Analyze & Create Profile
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
