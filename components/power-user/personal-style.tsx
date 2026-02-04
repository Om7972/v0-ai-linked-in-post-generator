"use client"

import { useState } from "react"
import { Type, PenTool, Check, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface Style {
    id: string
    name: string
    description: string
    examples: string[]
}

interface PersonalStyleProps {
    onSelectStyle: (styleInstruction: string) => void
}

export function PersonalStyle({ onSelectStyle }: PersonalStyleProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [styles, setStyles] = useState<Style[]>([
        {
            id: "1",
            name: "Thought Leader",
            description: "Authoritative, insightful, and professional",
            examples: ["In my experience leading teams...", "The future of AI involves..."]
        },
        {
            id: "2",
            name: "Casual & Relatable",
            description: "Friendly, emoji-rich, and personal stories",
            examples: ["So this happened today... 😅", "I used to think that..."]
        }
    ])
    const [newStyleName, setNewStyleName] = useState("")
    const [newStyleExamples, setNewStyleExamples] = useState("")
    const { toast } = useToast()

    const handleCreateStyle = () => {
        if (!newStyleName || !newStyleExamples) return

        const newStyle: Style = {
            id: Date.now().toString(),
            name: newStyleName,
            description: "Custom personal style",
            examples: newStyleExamples.split("\n").filter(e => e.trim().length > 0)
        }

        setStyles([...styles, newStyle])
        setNewStyleName("")
        setNewStyleExamples("")
        setIsOpen(false)
        toast({
            title: "Style Saved",
            description: `${newStyleName} has been added to your styles.`
        })
    }

    const handleDeleteStyle = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setStyles(styles.filter(s => s.id !== id))
    }

    const handleSelect = (style: Style) => {
        const instruction = `Write in a ${style.name} style. Characteristics: ${style.description}. Examples of tone: ${style.examples.join(" | ")}`
        onSelectStyle(instruction)
        toast({
            title: "Style Applied",
            description: `Writing style set to: ${style.name}`
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 h-9">
                        <PenTool className="h-4 w-4 text-emerald-500" />
                        <span className="hidden sm:inline">Writing Style</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Choose Style</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {styles.map((style) => (
                        <DropdownMenuItem
                            key={style.id}
                            onClick={() => handleSelect(style)}
                            className="flex justify-between items-center group cursor-pointer"
                        >
                            <span>{style.name}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 opacity-0 group-hover:opacity-100 hover:text-destructive"
                                onClick={(e) => handleDeleteStyle(style.id, e)}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Style
                        </DropdownMenuItem>
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Personal Writing Style</DialogTitle>
                    <DialogDescription>
                        Train the AI to write like you by providing examples of your best posts.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Style Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Founder Mode, Tech Analyst"
                            value={newStyleName}
                            onChange={(e) => setNewStyleName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="examples">Your Content Examples (3-5 posts)</Label>
                        <Textarea
                            id="examples"
                            placeholder="Paste your past successful posts here..."
                            className="min-h-[150px]"
                            value={newStyleExamples}
                            onChange={(e) => setNewStyleExamples(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            The AI will analyze these examples to match your tone, sentence structure, and vocabulary.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateStyle} disabled={!newStyleName || !newStyleExamples}>
                        Save Style
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
