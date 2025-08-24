import React, { useState } from 'react';

interface QueryEditorProps {
    onQuerySubmit: (query: string) => void;
    query: string;
    setQuery: (q: string) => void;
    loading?: boolean;
}

const QueryEditor: React.FC<QueryEditorProps> = ({ onQuerySubmit, query, setQuery, loading }) => {
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuery(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onQuerySubmit(query);
    };

    return (
        <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#1d4ed8' }}>
                SPARQL Query Editor
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <textarea
                    value={query}
                    onChange={handleChange}
                    rows={12}
                    style={{
                        width: '100%',
                        padding: '16px',
                        border: '2px solid #cbd5e1',
                        borderRadius: '12px',
                        backgroundColor: '#f8fafc',
                        color: '#374151',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        resize: 'vertical',
                        outline: 'none'
                    }}
                    placeholder="Enter your SPARQL query here..."
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                        width: '100%',
                        padding: '16px 32px',
                        fontSize: '18px',
                        opacity: loading ? 0.5 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                    disabled={loading}
                >
                    {loading ? 'Running Query...' : 'Execute Query'}
                </button>
            </form>
        </div>
    );
};

export default QueryEditor;