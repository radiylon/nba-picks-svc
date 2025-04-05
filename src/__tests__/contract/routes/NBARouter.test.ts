import request from 'supertest';
import { expect } from 'chai';
import app from '../../../app';

describe('NBARouter', () => {
  const mockResponse = {
    "Team Name": "Atlanta Hawks",
    "Draft Rounds": {
      "1": 11,
      "2": 8,
      "null": 5
    }
  };

  it('should return 400 for invalid team ID', async () => {
    const response = await request(app)
      .get('/v1/draft-pick-counts/invalid')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).to.deep.equal({
      error: {
        message: 'Invalid team ID. Team ID must be a number.',
        status: 400
      }
    });
  });

  it('should return 404 for non-existent team ID', async () => {
    const response = await request(app)
      .get('/v1/draft-pick-counts/9999')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).to.deep.equal({
      error: {
        message: 'Failed to fetch draft pick count for team with ID 9999',
        status: 404
      }
    });
  });

  
  it('should return 200 and correct response format for valid team ID', async () => {
    const response = await request(app)
      .get('/v1/draft-pick-counts/1')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).to.deep.equal(mockResponse);
  });
});
