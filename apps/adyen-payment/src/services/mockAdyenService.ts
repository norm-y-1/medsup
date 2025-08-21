// Mock Adyen service for development and testing
export class MockAdyenService {
  private static instance: MockAdyenService;

  public static getInstance(): MockAdyenService {
    if (!MockAdyenService.instance) {
      MockAdyenService.instance = new MockAdyenService();
    }
    return MockAdyenService.instance;
  }

  /**
   * Create a mock session for Adyen Web SDK
   */
  async createSession(amount: number, currency: string, reference: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock session data that mimics real Adyen session response
    return {
      id: `CS${Math.random().toString(36).substr(2, 16).toUpperCase()}`,
      sessionData: this.generateMockSessionData(),
      amount: {
        currency: currency,
        value: amount * 100 // Convert to minor units (cents)
      },
      countryCode: 'NL',
      shopperLocale: 'en-US',
      merchantAccount: 'MedSupProECOM',
      reference: reference,
      returnUrl: `${window.location.origin}/payment/result`,
      paymentMethodsResponse: {
        paymentMethods: [
          {
            name: 'Credit Card',
            type: 'scheme',
            brands: ['visa', 'mc', 'amex', 'discover'],
            details: [
              { key: 'number', type: 'cardToken' },
              { key: 'expiryMonth', type: 'cardToken' },
              { key: 'expiryYear', type: 'cardToken' },
              { key: 'cvc', type: 'cardToken' },
              { key: 'holderName', type: 'cardToken', optional: true }
            ]
          },
          {
            name: 'iDEAL',
            type: 'ideal',
            details: [
              {
                key: 'issuer',
                type: 'select',
                items: [
                  { id: '1121', name: 'Test Issuer' },
                  { id: '1154', name: 'Test Issuer 2' },
                  { id: '1153', name: 'Test Issuer 3' }
                ]
              }
            ]
          },
          {
            name: 'BLIK',
            type: 'blik'
          },
          {
            name: 'Klarna Pay now',
            type: 'klarna'
          }
        ]
      }
    };
  }

  /**
   * Submit payment (mock implementation)
   */
  async submitPayment(paymentData: any) {
    console.log('Mock payment submission:', paymentData);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate different payment outcomes
    const outcomes = ['Authorised', 'Refused', 'Pending'];
    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    
    if (randomOutcome === 'Authorised') {
      return {
        resultCode: 'Authorised',
        pspReference: `PSP${Math.random().toString(36).substr(2, 16).toUpperCase()}`,
        merchantReference: paymentData.reference || `ORDER_${Date.now()}`,
        additionalData: {
          cardSummary: '1111',
          paymentMethod: 'visa'
        }
      };
    } else if (randomOutcome === 'Refused') {
      return {
        resultCode: 'Refused',
        refusalReason: 'Insufficient funds',
        pspReference: `PSP${Math.random().toString(36).substr(2, 16).toUpperCase()}`
      };
    } else {
      return {
        resultCode: 'Pending',
        pspReference: `PSP${Math.random().toString(36).substr(2, 16).toUpperCase()}`,
        action: {
          type: 'redirect',
          url: 'https://checkoutshopper-test.adyen.com/checkoutshopper/demo/...',
          method: 'GET'
        }
      };
    }
  }

  /**
   * Handle additional payment actions (3D Secure, etc.)
   */
  async handleAction(actionData: any) {
    console.log('Mock action handling:', actionData);
    
    // Simulate 3D Secure completion
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      resultCode: 'Authorised',
      pspReference: `PSP${Math.random().toString(36).substr(2, 16).toUpperCase()}`,
      merchantReference: `ORDER_${Date.now()}`
    };
  }

  /**
   * Generate mock session data string
   */
  private generateMockSessionData(): string {
    const sessionData = {
      id: `CS${Math.random().toString(36).substr(2, 16).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      environment: 'test',
      version: '1.0'
    };
    
    return btoa(JSON.stringify(sessionData));
  }

  /**
   * Get available payment methods for the current session
   */
  async getPaymentMethods(_amount: number, _currency: string, _countryCode: string = 'NL') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      paymentMethods: [
        {
          name: 'Cards',
          type: 'scheme',
          brands: ['visa', 'mc', 'amex', 'discover', 'maestro'],
          details: [
            { key: 'number', type: 'cardToken' },
            { key: 'expiryMonth', type: 'cardToken' },
            { key: 'expiryYear', type: 'cardToken' },
            { key: 'cvc', type: 'cardToken' },
            { key: 'holderName', type: 'cardToken', optional: true }
          ],
          configuration: {
            merchantId: 'TestMerchant',
            merchantName: 'InsureCare POC'
          }
        },
        {
          name: 'iDEAL',
          type: 'ideal',
          details: [
            {
              key: 'issuer',
              type: 'select',
              items: [
                { id: '1121', name: 'Test Issuer' },
                { id: '1154', name: 'Test Issuer 2' }
              ]
            }
          ]
        },
        {
          name: 'BLIK',
          type: 'blik',
          details: [
            { key: 'blikCode', type: 'text' }
          ]
        }
      ]
    };
  }
}

export const mockAdyenService = MockAdyenService.getInstance();
