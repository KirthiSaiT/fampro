'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Trash2 } from 'lucide-react';

interface Category {
    _id: string;
    name: string;
    words: string[];
}

interface CategoryListProps {
    categories: Category[];
    onPlay: (category: Category) => void;
    onDelete: (id: string) => void;
}

export function CategoryList({ categories, onPlay, onDelete }: CategoryListProps) {
    if (categories.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400 text-base sm:text-lg">No categories yet</p>
                <p className="text-gray-500 text-sm mt-2">Create your first category to start playing!</p>
            </div>
        );
    }

    return (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
                <Card
                    key={category._id}
                    className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.98]"
                >
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg sm:text-xl font-bold text-white truncate mr-2">{category.name}</h3>
                            <Badge className="bg-purple-600/30 text-purple-300 border-purple-500/30 shrink-0">
                                {category.words.length} words
                            </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4 max-h-16 sm:max-h-20 overflow-hidden">
                            {category.words.slice(0, 4).map((word, index) => (
                                <span key={index} className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                                    {word}
                                </span>
                            ))}
                            {category.words.length > 4 && (
                                <span className="text-xs text-gray-500 px-2 py-1">
                                    +{category.words.length - 4} more
                                </span>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => onPlay(category)}
                                className="flex-1 h-11 sm:h-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:scale-95 transition-transform"
                            >
                                <Play className="h-4 w-4 mr-2" /> Play
                            </Button>
                            <Button
                                onClick={() => onDelete(category._id)}
                                variant="outline"
                                size="icon"
                                className="h-11 w-11 sm:h-10 sm:w-10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 active:scale-95 transition-transform"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

