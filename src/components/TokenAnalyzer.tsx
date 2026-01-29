import React, { useState } from 'react';
import { useTokenAnalyzer } from '../hooks/useTokenAnalyzer';
import { Search, Loader2 } from 'lucide-react';

export const TokenAnalyzer: React.FC = () => {
    const [address, setAddress] = useState('');
    const [chain, setChain] = useState('ethereum');
    const { analyzeToken, loading, stats, error } = useTokenAnalyzer();

    const handleAnalyze = (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) return;
        analyzeToken(chain, address);
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
            <h3 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                Token Deep Analyzer
            </h3>

            <form onSubmit={handleAnalyze} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) 3fr auto', gap: '1rem', marginBottom: '2rem' }}>
                <select
                    value={chain}
                    onChange={e => setChain(e.target.value)}
                    style={{
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        background: 'var(--color-bg-secondary)',
                        color: 'white',
                        border: '1px solid var(--color-border)',
                        outline: 'none'
                    }}
                >
                    <option value="ethereum">Ethereum</option>
                    <option value="bsc">BSC</option>
                </select>

                <input
                    type="text"
                    placeholder="Paste ERC20 Token Address (0x...)"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        background: 'var(--color-bg-secondary)',
                        color: 'white',
                        border: '1px solid var(--color-border)',
                        outline: 'none'
                    }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '0 1.5rem',
                        borderRadius: '0.5rem',
                        background: 'var(--color-primary)',
                        color: 'white',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? <Loader2 className="loader" size={18} /> : <Search size={18} />}
                    Analyze
                </button>
            </form>

            {error && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', borderRadius: '0.5rem' }}>
                    {error}
                </div>
            )}

            {stats && (
                <div className="animate-fade-in">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '1rem' }}>
                            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                Total Volume (Last {stats.scannedBlocks} Blocks)
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>{stats.totalVolume}</div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '1rem' }}>
                            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Transactions</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.txCount}</div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '1rem' }}>
                            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Unique Active Wallets</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)' }}>{stats.uniqueTraders}</div>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Top 5 Whale Transactions</h4>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {stats.whaleTxs.map((tx, idx) => (
                                <div key={idx} className="flex-center" style={{
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: '0.5rem',
                                    borderLeft: '2px solid var(--color-primary)'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '1rem', fontWeight: 600 }}>{tx.amount}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                                            {tx.from.slice(0, 6)}...{tx.from.slice(-4)} → {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                                        </div>
                                    </div>
                                    <a
                                        href={chain === 'bsc' ? `https://bscscan.com/tx/${tx.hash}` : `https://etherscan.io/tx/${tx.hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            color: 'white',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        View Tx
                                    </a>
                                </div>
                            ))}
                            {stats.whaleTxs.length === 0 && <div style={{ color: 'var(--color-text-secondary)' }}>No transactions found in this range.</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
