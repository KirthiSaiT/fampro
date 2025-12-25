'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface CategoryFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function CategoryForm({ onSuccess, onCancel }: CategoryFormProps) {
    const [categoryName, setCategoryName] = useState('');
    const [currentWord, setCurrentWord] = useState('');
    const [words, setWords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const addWord = () => {
        if (currentWord.trim() && !words.includes(currentWord.trim())) {
            setWords([...words, currentWord.trim()]);
            setCurrentWord('');
        }
    };

    const removeWord = (wordToRemove: string) => {
        setWords(words.filter(word => word !== wordToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addWord();
        }
    };

    const handleSubmit = async () => {
        if (!categoryName.trim() || words.length === 0) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: categoryName.trim(), words })
            });

            if (response.ok) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error creating category:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30">
            <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-xl sm:text-2xl text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Create Category
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
                <div>
                    <Input
                        placeholder="Category name (e.g., Movies)"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="h-12 sm:h-10 bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400 text-base"
                    />
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="Add word + Enter"
                        value={currentWord}
                        onChange={(e) => setCurrentWord(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-12 sm:h-10 bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400 text-base"
                    />
                    <Button
                        onClick={addWord}
                        size="icon"
                        className="h-12 w-12 sm:h-10 sm:w-10 bg-purple-600 hover:bg-purple-700 shrink-0"
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>

                {words.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-black/20 rounded-lg min-h-[60px] max-h-[150px] overflow-y-auto">
                        {words.map((word, index) => (
                            <Badge
                                key={index}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 text-sm"
                            >
                                {word}
                                <button
                                    onClick={() => removeWord(word)}
                                    className="ml-2 hover:text-red-300 p-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}

                <p className="text-sm text-gray-400 text-center">
                    {words.length} word{words.length !== 1 ? 's' : ''} added
                </p>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                        onClick={onCancel}
                        variant="outline"
                        className="flex-1 h-12 sm:h-10 border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!categoryName.trim() || words.length === 0 || isLoading}
                        className="flex-1 h-12 sm:h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                        {isLoading ? 'Saving...' : 'Save Category'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

