export interface ChainConfig {
    id: string;
    name: string;
    symbol: string;
    rpcUrl: string;
    type: 'evm' | 'solana';
    color: string;
}

export const CHAINS: Record<string, ChainConfig> = {
    ethereum: {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        rpcUrl: 'https://rpc.ankr.com/eth',
        type: 'evm',
        color: '#627EEA'
    },
    bsc: {
        id: 'bsc',
        name: 'BNB Smart Chain',
        symbol: 'BNB',
        rpcUrl: 'https://binance.llamarpc.com',
        type: 'evm',
        color: '#F3BA2F'
    },
    solana: {
        id: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        type: 'solana',
        color: '#14F195'
    }
};
