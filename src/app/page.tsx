'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CategoryForm } from '@/components/category-form';
import { CategoryList } from '@/components/category-list';
import { GameScreen } from '@/components/game-screen';
import { Plus } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  words: string[];
}

type View = 'home' | 'create' | 'play';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [view, setView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePlay = (category: Category) => {
    setSelectedCategory(category);
    setView('play');
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setCategories(categories.filter(cat => cat._id !== id));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleCreateSuccess = () => {
    fetchCategories();
    setView('home');
  };

  // Game view
  if (view === 'play' && selectedCategory) {
    return (
      <GameScreen
        category={selectedCategory}
        onExit={() => {
          setView('home');
          setSelectedCategory(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            🎭 Charades
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">Family Edition</p>
        </div>

        {view === 'create' ? (
          <CategoryForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setView('home')}
          />
        ) : (
          <>
            {/* Create button */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <Button
                onClick={() => setView('create')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto"
              >
                <Plus className="h-5 w-5 mr-2" /> Create Category
              </Button>
            </div>

            {/* Categories */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Your Categories</h2>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">Loading categories...</p>
                </div>
              ) : (
                <CategoryList
                  categories={categories}
                  onPlay={handlePlay}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

