import { ApiResponse, BalldontlieAPI as bdlAPI, NBAPlayer, NBATeam } from "@balldontlie/sdk";
import config from "../config/config";

interface TeamDraftPickCounts {
  "Team Name": string;
  "Draft Rounds": {
    "1": number,
    "2": number,
    "null": number
  }
}

export default class NBAService {
  private api: any;

  constructor() {
    if (!config.ballDontLieApiKey) {
      throw new Error('BallDontLie API key is not configured');
    }
    this.api = new bdlAPI({ apiKey: config.ballDontLieApiKey });
  }

  async getTeams(): Promise<ApiResponse<NBATeam[]>> {
    try {
      const teams = await this.api.nba.getTeams();
      const filteredTeams = teams.data.filter((t: NBATeam) => t.conference === 'East' || t.conference === 'West');
      return { data: filteredTeams};
    } catch(err) {
      throw new Error(`Failed to fetch NBA teams: ${err}`);
    }
  }

  async getTeamById(teamId: number): Promise<ApiResponse<NBATeam>> {
    try {
      const team = await this.api.nba.getTeam(teamId);
      return team;
    } catch(err) {
      throw new Error(`Failed to fetch NBA team with ID ${teamId}: ${err}`);
    }
  }

  async getPlayersByTeamId(teamId: number): Promise<ApiResponse<NBAPlayer[]>> {
    try {
      const players = await this.api.nba.getPlayers({ team_ids: [teamId] });
      return players;
    } catch(err) {
      throw new Error(`Failed to fetch NBA players for team with ID ${teamId}: ${err}`);
    }
  }
  
  async getDraftPickCountByTeamId(teamId: number): Promise<TeamDraftPickCounts> {
    try {
      const [team, players] = await Promise.all([
        this.getTeamById(teamId),
        this.getPlayersByTeamId(teamId)
      ]);

      let draftPickCounts: TeamDraftPickCounts["Draft Rounds"] = {
        "1": 0,
        "2": 0,
        "null": 0
      };

      players.data.forEach((player: NBAPlayer) => {
        if (player.draft_year === null) {
          draftPickCounts["null"] += 1;
        }
        if (player.draft_round) {
          const roundKey = player.draft_round.toString();
          if (roundKey === "1" || roundKey === "2") {
            draftPickCounts[roundKey] += 1;
          }
        }
      });
      
      const teamName = team.data.full_name;

      return { 
        "Team Name": teamName,
        "Draft Rounds": draftPickCounts
      };
    } catch(err) {
      const error = new Error(`Failed to fetch draft pick count for team with ID ${teamId}`) as any;
      error.status = 404;
      throw error;
    }
  }
}