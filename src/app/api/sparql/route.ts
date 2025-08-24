import { NextResponse } from 'next/server';

import { fetchSparqlResults } from '@/lib/sparql-client';

export async function POST(request: Request) {
    const { query } = await request.json();

    if (!query) {
        return NextResponse.json({ error: 'No SPARQL query provided' }, { status: 400 });
    }


    try {
        const results = await fetchSparqlResults(query);
        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}