import React from 'react';
import type { ChainConfig } from '../utils/chains';
import type { ChainData } from '../hooks/useChainData';
import { Box, Layers, Zap } from 'lucide-react';

interface StatsCardProps {
    chain: ChainConfig;
    data: ChainData;
}

export const StatsCard: React.FC<StatsCardProps> = ({ chain, data }) => {
    return (
        <div
            className="glass-panel animate-fade-in"
            style={{
                padding: '1.5rem',
                textAlign: 'left',
                borderTop: `2px solid ${chain.color}`,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '100px',
                    height: '100px',
                    background: chain.color,
                    opacity: 0.1,
                    filter: 'blur(40px)',
                    borderRadius: '50%'
                }}
            />

            <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '1.5rem', position: 'relative' }}>
                <h3 style={{ fontSize: '1.25rem' }}>{chain.name}</h3>
                <span style={{
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.6rem',
                    background: `${chain.color}33`, // 20% opacity hex
                    color: chain.color,
                    borderRadius: '6px',
                    fontWeight: 600
                }}>
                    {chain.symbol}
                </span>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                        Token Price (USD)
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                        {data.priceUsd ? `$${data.priceUsd.toLocaleString()}` : <span className="loader" style={{ width: '16px', height: '16px' }}></span>}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                            <Layers size={14} />
                            <span>Height</span>
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600, fontFamily: 'monospace' }}>
                            {data.loading ? '...' : data.blockHeight.toLocaleString()}
                        </div>
                    </div>

                    <div>
                        <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                            <Zap size={14} />
                            <span>TPS</span>
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                            {data.loading ? '...' : data.tps}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                        24h Vol
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {data.volume24h || '...'}
                    </div>
                </div>

                {data.gasPrice && (
                    <div>
                        <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                            <Box size={14} />
                            <span>Gas Price</span>
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 500 }}>
                            {data.loading ? '...' : parseFloat(data.gasPrice).toFixed(9)} {chain.symbol}
                        </div>
                    </div>
                )}
            </div>

            {data.error && (
                <div style={{ marginTop: '1rem', color: 'var(--color-danger)', fontSize: '0.875rem' }}>
                    Error: {data.error}
                </div>
            )}
        </div>
    );
};
