import React from 'react';

interface ResultTableProps {
    data: Array<Record<string, any>>;
    columns: Array<{ header: string; accessor: string }>;
}

const ResultsTable: React.FC<ResultTableProps> = ({ data, columns }) => {
    return (
        <div style={{ 
            overflowX: 'auto', 
            borderRadius: '12px', 
            border: '2px solid #cbd5e1',
            backgroundColor: 'white'
        }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                    <tr>
                        {columns.map((column) => (
                            <th 
                                key={column.accessor} 
                                style={{
                                    padding: '16px 24px',
                                    textAlign: 'left',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    borderBottom: '2px solid #1e40af'
                                }}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr 
                                key={rowIndex} 
                                style={{ 
                                    backgroundColor: rowIndex % 2 === 0 ? '#f8fafc' : 'white',
                                    transition: 'background-color 0.15s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = rowIndex % 2 === 0 ? '#f8fafc' : 'white'}
                            >
                                {columns.map((column) => (
                                    <td 
                                        key={column.accessor} 
                                        style={{
                                            padding: '16px 24px',
                                            fontSize: '14px',
                                            color: '#374151',
                                            borderBottom: '1px solid #e5e7eb'
                                        }}
                                    >
                                        <div style={{ 
                                            maxWidth: '200px', 
                                            overflow: 'hidden', 
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {row[column.accessor]?.value || row[column.accessor] || '-'}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td 
                                colSpan={columns.length} 
                                style={{
                                    padding: '32px 24px',
                                    textAlign: 'center',
                                    color: '#6b7280',
                                    fontStyle: 'italic'
                                }}
                            >
                                No results found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsTable;