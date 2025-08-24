import React from 'react';

const ValidationPanel = ({ validationResults }) => {
    return (
        <div className="validation-panel">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Validation Results</h2>
            {validationResults.length > 0 ? (
                <div className="space-y-4">
                    {validationResults.map((result, index) => (
                        <div 
                            key={index} 
                            className={`p-4 rounded-xl border-l-4 shadow ${
                                result.valid 
                                    ? 'bg-green-50 border-green-400 text-green-800' 
                                    : 'bg-red-50 border-red-400 text-red-800'
                            }`}
                        >
                            <div className="flex items-center">
                                {result.valid ? (
                                    <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <span className="font-semibold">{result.message}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-blue-300 mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-blue-400 text-lg">No validation results available. Click "Run Validations" to start.</p>
                </div>
            )}
        </div>
    );
};

export default ValidationPanel;