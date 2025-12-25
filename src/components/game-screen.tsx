'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Check, ArrowLeft, RotateCcw } from 'lucide-react';

interface Category {
    _id: string;
    name: string;
    words: string[];
}

interface GameScreenProps {
    category: Category;
    onExit: () => void;
}

export function GameScreen({ category, onExit }: GameScreenProps) {
    const [shuffledWords, setShuffledWords] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [gameEnded, setGameEnded] = useState(false);

    useEffect(() => {
        // Shuffle words when game starts
        const shuffled = [...category.words].sort(() => Math.random() - 0.5);
        setShuffledWords(shuffled);
    }, [category.words]);

    const handleCorrect = () => {
        setCorrect(prev => prev + 1);
        nextWord();
    };

    const handleWrong = () => {
        setWrong(prev => prev + 1);
        nextWord();
    };

    const nextWord = () => {
        if (currentIndex + 1 >= shuffledWords.length) {
            setGameEnded(true);
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const restartGame = () => {
        const shuffled = [...category.words].sort(() => Math.random() - 0.5);
        setShuffledWords(shuffled);
        setCurrentIndex(0);
        setCorrect(0);
        setWrong(0);
        setGameEnded(false);
    };

    if (shuffledWords.length === 0) {
        return (
            <div className="min-h-screen min-h-[100dvh] flex items-center justify-center">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    if (gameEnded) {
        return (
            <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center p-4 pb-safe bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <Card className="w-full max-w-md bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-purple-500/30">
                    <CardContent className="p-6 sm:p-8 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Game Over!
                        </h2>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <div className="bg-green-600/20 rounded-xl p-3 sm:p-4 border border-green-500/30">
                                <p className="text-3xl sm:text-4xl font-bold text-green-400">{correct}</p>
                                <p className="text-green-300 text-xs sm:text-sm">Correct</p>
                            </div>
                            <div className="bg-red-600/20 rounded-xl p-3 sm:p-4 border border-red-500/30">
                                <p className="text-3xl sm:text-4xl font-bold text-red-400">{wrong}</p>
                                <p className="text-red-300 text-xs sm:text-sm">Wrong</p>
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                            You completed {shuffledWords.length} words in &quot;{category.name}&quot;
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={onExit}
                                variant="outline"
                                className="flex-1 h-12 sm:h-10 border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" /> Exit
                            </Button>
                            <Button
                                onClick={restartGame}
                                className="flex-1 h-12 sm:h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                <RotateCcw className="h-4 w-4 mr-2" /> Play Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen min-h-[100dvh] flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-black/30 safe-top">
                <Button
                    onClick={onExit}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white px-2 sm:px-4"
                >
                    <ArrowLeft className="h-5 w-5 sm:mr-2" />
                    <span className="hidden sm:inline">Exit</span>
                </Button>
                <div className="text-center">
                    <p className="text-purple-400 font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{category.name}</p>
                    <p className="text-gray-500 text-xs sm:text-sm">{currentIndex + 1} / {shuffledWords.length}</p>
                </div>
                <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm">
                    <span className="text-green-400">✓ {correct}</span>
                    <span className="text-red-400">✗ {wrong}</span>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
                <div className="text-center w-full">
                    <p className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold text-white mb-2 sm:mb-4 break-words px-2 leading-tight">
                        {shuffledWords[currentIndex]}
                    </p>
                    <p className="text-gray-500 text-base sm:text-lg">Act it out!</p>
                </div>
            </div>

            {/* Action buttons - larger on mobile for easier tapping */}
            <div className="flex justify-between p-4 sm:p-6 gap-3 sm:gap-4 pb-safe">
                <Button
                    onClick={handleWrong}
                    className="flex-1 h-20 sm:h-24 text-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-2xl shadow-lg shadow-red-500/30 active:scale-95 transition-transform"
                >
                    <X className="h-8 w-8 sm:h-10 sm:w-10" />
                </Button>
                <Button
                    onClick={handleCorrect}
                    className="flex-1 h-20 sm:h-24 text-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-2xl shadow-lg shadow-green-500/30 active:scale-95 transition-transform"
                >
                    <Check className="h-8 w-8 sm:h-10 sm:w-10" />
                </Button>
            </div>
        </div>
    );
}

