import { createMocks } from 'node-mocks-http';
import handler from '../../../pages/api/portfolio-summary';

describe('/api/portfolio-summary', () => {
  it('returns portfolio summary data', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('totalValue');
    expect(data).toHaveProperty('assets');
    expect(Array.isArray(data.assets)).toBe(true);
  });

  it('returns 405 for non-GET requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});