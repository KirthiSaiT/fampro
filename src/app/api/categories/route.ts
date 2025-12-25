import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET() {
    try {
        const db = await getDatabase();
        const categories = await db.collection('categories').find({}).toArray();

        // Convert ObjectId to string for JSON serialization
        const formattedCategories = categories.map(cat => ({
            ...cat,
            _id: cat._id.toString()
        }));

        return NextResponse.json(formattedCategories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, words } = body;

        if (!name || !words || !Array.isArray(words) || words.length === 0) {
            return NextResponse.json(
                { error: 'Name and words array are required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const result = await db.collection('categories').insertOne({
            name,
            words,
            createdAt: new Date()
        });

        return NextResponse.json({
            _id: result.insertedId.toString(),
            name,
            words,
            message: 'Category created successfully'
        });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
