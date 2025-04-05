import { expect } from 'chai';
import NBAService from '../../../services/NBAService';
import { NBATeam } from '@balldontlie/sdk';

describe('NBAService', () => {
  let nbaService: NBAService;

  const mockNBATeam: NBATeam = {
    id: 10,
    conference: 'West',
    division: 'Pacific',
    city: 'Golden State',
    name: 'Warriors',
    full_name: 'Golden State Warriors',
    abbreviation: 'GSW'
  }

  beforeEach(() => {
    nbaService = new NBAService();
  });

  describe('getTeams', () => {
    it('should return an array of NBA teams', async () => {
      const result = await nbaService.getTeams();
      expect(result.data).to.be.an('array');
      expect(result.data.length).to.equal(30); // 30 NBA teams
      result.data.forEach((team: NBATeam) => {
        expect(['East', 'West']).to.include(team.conference);
      });
    });
  });

  describe('getTeamById', () => {
    it('should throw an error for non-existent team ID', async () => {
      try {
        await nbaService.getTeamById(9999);
      } catch (err: any) {
        expect(err).to.be.an('error');
        expect(err.message).to.include('Failed to fetch NBA team with ID 9999');
      }
    });
    
    it('should return the correct NBA team data', async () => {
      const result = await nbaService.getTeamById(mockNBATeam.id);
      expect(result).to.be.an('object');
      expect(result.data).to.deep.equal(mockNBATeam);
    });
  });

  describe('getPlayersByTeamId', () => {
    it('should throw an error for non-existent team ID', async () => {
      try {
        await nbaService.getPlayersByTeamId(9999);
      } catch(err: any) {
        expect(err).to.be.an('error');
        expect(err.message).to.include('Failed to fetch NBA players for team with ID 9999');
      }
    });

    it('should return an array of players', async () => {
      const result = await nbaService.getPlayersByTeamId(mockNBATeam.id);
      expect(result.data).to.be.an('array');
      expect(result.data.length).to.be.greaterThan(0);
    });
  });

  describe('getDraftPickCountByTeamId', () => {
    const mockResult = {
      "Team Name": "Golden State Warriors",
      "Draft Rounds": {
        "1": 0,
        "2": 0,
        "null": 0
      }
    }

    it('should throw an error for non-existent team ID', async () => {
      try {
        await nbaService.getDraftPickCountByTeamId(9999);
      } catch (err: any) {
        expect(err).to.be.an('error');
        console.log(err.message);
        expect(err.message).to.include('Failed to fetch draft pick count for team with ID 9999');
      }
    });

    it('should return the correct team name', async () => {
      const result = await nbaService.getDraftPickCountByTeamId(mockNBATeam.id);
      const teamName = result["Team Name"];
      expect(teamName).to.equal(mockResult["Team Name"]);
    });

    it('should return the correct draft pick counts', async () => {
      const result = await nbaService.getDraftPickCountByTeamId(mockNBATeam.id);
      const draftRounds = result["Draft Rounds"];
      Object.values(draftRounds).forEach((count) => {
        expect(typeof count).to.equal('number');
      });
    });
  });
}); 