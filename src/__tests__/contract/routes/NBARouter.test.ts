import request from 'supertest';
import { expect } from 'chai';
import app from '../../../app';

describe('NBARouter', function() {
  // NOTE: This is a workaround to fix a timeout issue on StackBlitz
  this.timeout(10000);

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
        errorCode: 'INVALID_TEAM_ID',
        status: 400,
        metadata: { teamId: 'invalid' }
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
        errorCode: 'DRAFT_PICKS_FETCH_ERROR',
        status: 404,
        metadata: { teamId: 9999 }
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
