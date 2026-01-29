import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useMultiChainSearch } from '../hooks/useMultiChainSearch';

export const SearchBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const { search, loading, results, error, clear } = useMultiChainSearch();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        search(query);
    };

    const handleClear = () => {
        setQuery('');
        clear();
    };

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <form onSubmit={handleSearch} className="flex-center" style={{ position: 'relative' }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Transaction Hash..."
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.75rem',
                        background: 'var(--color-bg-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '999px',
                        color: 'white',
                        outline: 'none',
                        fontSize: '0.9rem',
                        backdropFilter: 'blur(10px)'
                    }}
                />
                <Search
                    size={18}
                    style={{ position: 'absolute', left: '1rem', color: 'var(--color-text-secondary)' }}
                />
                {loading && (
                    <div className="loader" style={{ position: 'absolute', right: '1rem', width: '16px', height: '16px', borderWidth: '2px' }} />
                )}
                {!loading && query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        style={{ position: 'absolute', right: '1rem', color: 'var(--color-text-secondary)' }}
                    >
                        <X size={16} />
                    </button>
                )}
            </form>

            {/* Results Dropdown */}
            {(results.length > 0 || error) && (
                <div className="glass-panel animate-fade-in" style={{
                    position: 'absolute',
                    top: '120%',
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    padding: '1rem',
                    maxHeight: '300px',
                    overflowY: 'auto'
                }}>
                    {error && (
                        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    {results.map((res, idx) => (
                        <div key={idx} style={{
                            padding: '0.75rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '0.5rem',
                            marginBottom: '0.5rem'
                        }}>
                            <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                                    FOUND ON {res.chain.toUpperCase()}
                                </span>
                                <ArrowRight size={14} color="var(--color-text-muted)" />
                            </div>
                            <div style={{ fontSize: '0.875rem', wordBreak: 'break-all', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>
                                {res.hash}
                            </div>
                            {res.type === 'transaction' && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                    Type: Transaction
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
