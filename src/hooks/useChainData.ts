import { useState, useEffect } from 'react';
import { JsonRpcProvider, formatEther } from 'ethers';
import { Connection } from '@solana/web3.js';
import { CHAINS, type ChainConfig } from '../utils/chains';

export interface ChainData {
    chainId: string;
    blockHeight: number;
    gasPrice?: string;
    tps?: number;
    volume24h?: string;
    priceUsd?: number;
    loading: boolean;
    error?: string;
}

// CoinGecko IDs mapping
const COINGECKO_IDS: Record<string, string> = {
    ethereum: 'ethereum',
    bsc: 'binancecoin',
    solana: 'solana'
};

async function fetchPrices() {
    try {
        const ids = Object.values(COINGECKO_IDS).join(',');
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_vol=true`);
        if (!response.ok) throw new Error('Price API failed');
        return await response.json();
    } catch (err) {
        console.error('Error fetching prices:', err);
        return null;
    }
}

// Helper to fetch EVM data (RPC only)
async function fetchEvmData(chain: ChainConfig): Promise<Partial<ChainData>> {
    try {
        const provider = new JsonRpcProvider(chain.rpcUrl);
        const blockNumber = await provider.getBlockNumber();
        const feeData = await provider.getFeeData();

        // TPS calculation (simplified)
        const block = await provider.getBlock(blockNumber);
        const txCount = block?.transactions.length || 0;
        const blockTime = chain.id === 'ethereum' ? 12 : 3;
        const tps = Math.round(txCount / blockTime);

        return {
            blockHeight: blockNumber,
            gasPrice: feeData.gasPrice ? formatEther(feeData.gasPrice) : undefined,
            tps,
            error: undefined
        };
    } catch (err: any) {
        console.error(`Error fetching ${chain.name} data:`, err);
        return { error: 'RPC Connect Error' };
    }
}

// Helper to fetch Solana data
async function fetchSolanaData(chain: ChainConfig): Promise<Partial<ChainData>> {
    try {
        const connection = new Connection(chain.rpcUrl);
        const blockHeight = await connection.getSlot();

        const performanceSamples = await connection.getRecentPerformanceSamples(1);
        const tps = performanceSamples[0]?.numTransactions
            ? Math.round(performanceSamples[0].numTransactions / performanceSamples[0].samplePeriodSecs)
            : 0;

        return {
            blockHeight,
            tps,
            error: undefined
        };
    } catch (err: any) {
        console.error(`Error fetching ${chain.name} data:`, err);
        return { error: 'RPC Connect Error' };
    }
}

export function useChainData() {
    const [data, setData] = useState<Record<string, ChainData>>({
        ethereum: { chainId: 'ethereum', blockHeight: 0, loading: true },
        bsc: { chainId: 'bsc', blockHeight: 0, loading: true },
        solana: { chainId: 'solana', blockHeight: 0, loading: true },
    });

    const fetchData = async () => {
        // 1. Fetch Prices first (single request)
        const priceData = await fetchPrices();

        // 2. Fetch RPC data in parallel
        const promises = Object.values(CHAINS).map(async (chain) => {
            let rpcResult;
            if (chain.type === 'evm') {
                rpcResult = await fetchEvmData(chain);
            } else {
                rpcResult = await fetchSolanaData(chain);
            }

            // Merge price data
            const cgId = COINGECKO_IDS[chain.id];
            const chainPriceData = priceData ? priceData[cgId] : null;

            setData(prev => ({
                ...prev,
                [chain.id]: {
                    ...prev[chain.id],
                    ...rpcResult,
                    priceUsd: chainPriceData?.usd,
                    volume24h: chainPriceData?.usd_24h_vol ? `$${(chainPriceData.usd_24h_vol / 1000000).toFixed(2)}M` : undefined,
                    loading: false
                }
            }));
        });

        await Promise.all(promises);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); // 15s refresh to be nice to rate limits
        return () => clearInterval(interval);
    }, []);

    return data;
}
