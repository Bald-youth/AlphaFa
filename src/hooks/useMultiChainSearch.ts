import { useState } from 'react';
import { JsonRpcProvider } from 'ethers';
import { Connection } from '@solana/web3.js';
import { CHAINS } from '../utils/chains';

export interface SearchResult {
    chain: string;
    type: 'transaction' | 'account' | 'block';
    hash: string;
    data: any; // Raw data for display
}

export function useMultiChainSearch() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [error, setError] = useState<string | null>(null);

    const search = async (query: string) => {
        if (!query) return;
        setLoading(true);
        setError(null);
        setResults([]);

        const trimmedQuery = query.trim();
        const foundResults: SearchResult[] = [];

        // Basic heuristic
        const isEvmHash = /^0x([A-Fa-f0-9]{64})$/.test(trimmedQuery);
        const isSolanaSig = /^[1-9A-HJ-NP-Za-km-z]{80,100}$/.test(trimmedQuery); // Rough sig check

        const searchPromises = [];

        // Search EVM Chains (ETH, BSC)
        if (isEvmHash) {
            const evmChains = Object.values(CHAINS).filter(c => c.type === 'evm');

            searchPromises.push(...evmChains.map(async (chain) => {
                try {
                    const provider = new JsonRpcProvider(chain.rpcUrl);
                    const tx = await provider.getTransaction(trimmedQuery);
                    if (tx) {
                        foundResults.push({
                            chain: chain.name,
                            type: 'transaction',
                            hash: trimmedQuery,
                            data: {
                                from: tx.from,
                                to: tx.to,
                                value: tx.value.toString(),
                                blockNumber: tx.blockNumber
                            }
                        });
                    }
                } catch (e) {
                    // Ignore 404/null
                }
            }));
        }

        // Search Solana
        if (isSolanaSig || !isEvmHash) { // Fallback to try solana if not strictly 0x64
            // Note: Solana signatures are base58, length variable
            const solChain = CHAINS['solana'];
            searchPromises.push((async () => {
                try {
                    const connection = new Connection(solChain.rpcUrl);
                    // getTransaction is heavy/rate-limited often, try simple validation first
                    // For this MVP we try to fetch it.
                    const tx = await connection.getTransaction(trimmedQuery, { maxSupportedTransactionVersion: 0 });
                    if (tx) {
                        foundResults.push({
                            chain: solChain.name,
                            type: 'transaction',
                            hash: trimmedQuery,
                            data: {
                                slot: tx.slot,
                                custodian: 'Solana Chain'
                            }
                        });
                    }
                } catch (e) {
                    // Ignore
                }
            })());
        }

        await Promise.all(searchPromises);

        if (foundResults.length === 0) {
            setError('No transaction found on supported chains.');
        } else {
            setResults(foundResults);
        }
        setLoading(false);
    };

    return { search, loading, results, error, clear: () => setResults([]) };
}
