import { useState } from 'react';
import { JsonRpcProvider, Contract, formatUnits, id } from 'ethers';
import { CHAINS } from '../utils/chains';

export interface TokenStats {
    totalVolume: string;
    uniqueTraders: number;
    txCount: number;
    whaleTxs: { hash: string; amount: string; from: string; to: string }[];
    scannedBlocks: number;
}

const TRANSFER_TOPIC = id('Transfer(address,address,uint256)');

export function useTokenAnalyzer() {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<TokenStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    const analyzeToken = async (chainId: string, tokenAddress: string) => {
        setLoading(true);
        setError(null);
        setStats(null);

        try {
            const chain = CHAINS[chainId];
            if (!chain || chain.type !== 'evm') {
                throw new Error('Only EVM chains (ETH, BSC) are supported for this feature.');
            }

            if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) throw new Error('Invalid Token Address');

            const provider = new JsonRpcProvider(chain.rpcUrl);
            const currentBlock = await provider.getBlockNumber();

            // Start with 200 blocks (Optimistic attempt with LlamaRPC)
            let range = 200;
            let logs = [];

            try {
                console.log(`Scanning ${chain.name} last ${range} blocks...`);
                logs = await provider.getLogs({
                    address: tokenAddress,
                    topics: [TRANSFER_TOPIC],
                    fromBlock: currentBlock - range,
                    toBlock: currentBlock
                });
            } catch (e: any) {
                // Fallback to 50 if 200 fails
                console.warn('200 blocks failed, retrying with 50...');
                try {
                    range = 50;
                    logs = await provider.getLogs({
                        address: tokenAddress,
                        topics: [TRANSFER_TOPIC],
                        fromBlock: currentBlock - range,
                        toBlock: currentBlock
                    });
                } catch (finalError) {
                    throw new Error('Public RPC Node is busy. Please try again later.');
                }
            }

            console.log(`Found ${logs.length} logs.`);

            // Analytics Logic
            let totalAmount = 0n;
            const participants = new Set<string>();
            const whales: any[] = [];

            let decimals = 18;
            let symbol = 'TOKEN';
            try {
                const minimalAbi = [
                    "function decimals() view returns (uint8)",
                    "function symbol() view returns (string)"
                ];
                const contract = new Contract(tokenAddress, minimalAbi, provider);
                decimals = await contract.decimals();
                symbol = await contract.symbol();
            } catch (e) {
                console.warn('Could not fetch token details, assuming 18 decimals.');
            }

            // Process logs
            logs.forEach(log => {
                try {
                    const from = '0x' + log.topics[1].slice(26);
                    const to = '0x' + log.topics[2].slice(26);
                    const value = BigInt(log.data);

                    totalAmount += value;
                    participants.add(from);
                    participants.add(to);

                    whales.push({
                        hash: log.transactionHash,
                        rawAmount: value,
                        amount: '', // fill later
                        from,
                        to
                    });
                } catch (e) {
                    // ignore parsing error
                }
            });

            // Sort whales by value
            whales.sort((a, b) => (a.rawAmount < b.rawAmount ? 1 : -1));
            const topWhales = whales.slice(0, 5).map(w => ({
                ...w,
                amount: formatUnits(w.rawAmount, decimals) + ' ' + symbol
            }));

            const formattedVolume = formatUnits(totalAmount, decimals);

            setStats({
                totalVolume: parseFloat(formattedVolume).toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' ' + symbol,
                uniqueTraders: participants.size,
                txCount: logs.length,
                whaleTxs: topWhales,
                scannedBlocks: range
            });

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to analyze token');
        } finally {
            setLoading(false);
        }
    };

    return { analyzeToken, loading, stats, error };
}
