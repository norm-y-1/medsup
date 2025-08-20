import { CryptoCurrency } from '../types';

class CryptoService {
  private readonly baseUrl = 'https://api.coingecko.com/api/v3';
  
  async getSupportedCurrencies(): Promise<CryptoCurrency[]> {
    try {
      // Mock data for demo - in production, you'd fetch from a real API
      return [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'BTC',
          icon: '₿',
          price: 45000,
          enabled: true
        },
        {
          id: 'ethereum',
          name: 'Ethereum',
          symbol: 'ETH',
          icon: 'Ξ',
          price: 3000,
          enabled: true
        },
        {
          id: 'litecoin',
          name: 'Litecoin',
          symbol: 'LTC',
          icon: 'Ł',
          price: 150,
          enabled: true
        },
        {
          id: 'monero',
          name: 'Monero',
          symbol: 'XMR',
          icon: 'ɱ',
          price: 200,
          enabled: true
        }
      ];
    } catch (error) {
      console.error('Failed to fetch crypto currencies:', error);
      throw new Error('Failed to load supported currencies');
    }
  }

  async getExchangeRate(cryptoId: string, fiatCurrency: string): Promise<number> {
    try {
      // Mock calculation - in production, fetch real rates
      const currencies = await this.getSupportedCurrencies();
      const crypto = currencies.find(c => c.id === cryptoId);
      return crypto ? crypto.price : 0;
    } catch (error) {
      console.error('Failed to get exchange rate:', error);
      throw new Error('Failed to get exchange rate');
    }
  }

  calculateCryptoAmount(fiatAmount: number, exchangeRate: number): number {
    return Number((fiatAmount / exchangeRate).toFixed(8));
  }

  generateWalletAddress(cryptoId: string): string {
    // Mock wallet address generation
    const addresses = {
      bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      ethereum: '0x742d35Cc6634C0532925a3b8D9cC6a8e24E7aa9b',
      litecoin: 'LTC1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      monero: '4A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNaXMR'
    };
    return addresses[cryptoId as keyof typeof addresses] || 'unknown-address';
  }
}

export const cryptoService = new CryptoService();
