import { Activity } from 'lucide-react';
import './index.css';
import { useChainData } from './hooks/useChainData';
import { CHAINS } from './utils/chains';
import { StatsCard } from './components/StatsCard';
import { SearchBar } from './components/SearchBar';
import { TokenAnalyzer } from './components/TokenAnalyzer';

function App() {
  const chainData = useChainData();

  return (
    <div className="min-h-screen container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <header className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '4rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="flex-center" style={{ gap: '0.75rem' }}>
          <div className="glass-panel flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
            <Activity color="var(--color-primary)" size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', lineHeight: 1.2, fontWeight: 800 }}>AlphaData</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Multi-Chain Realtime Analytics</p>
          </div>
        </div>

        <SearchBar />

        <nav className="glass-panel" style={{ padding: '0.5rem', borderRadius: '999px', display: 'flex', gap: '0.5rem' }}>
          <button className="flex-center" style={{ padding: '0.6rem 1.25rem', borderRadius: '999px', background: 'var(--color-primary)', color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
            Dashboard
          </button>
          <button className="flex-center" style={{ padding: '0.6rem 1.25rem', borderRadius: '999px', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Settings
          </button>
        </nav>
      </header>

      <main>
        <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 800 }}>
            Live Network Status
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Monitoring block heights, TPS, and network performance across major blockchains in real-time.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <StatsCard chain={CHAINS.ethereum} data={chainData.ethereum} />
          <StatsCard chain={CHAINS.solana} data={chainData.solana} />
          <StatsCard chain={CHAINS.bsc} data={chainData.bsc} />
        </div>

        <TokenAnalyzer />
      </main>
    </div>
  );
}

export default App;
