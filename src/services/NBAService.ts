import { ApiResponse, BalldontlieAPI as bdlAPI, NBAPlayer, NBATeam } from "@balldontlie/sdk";
import config from "../config/config";
import { NBAError } from "../helpers/Error";

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
      throw new NBAError(
        'BallDontLie API key is not configured',
        'API_KEY_MISSING',
        500,
      );
    }
    this.api = new bdlAPI({ apiKey: config.ballDontLieApiKey });
  }

  /**
   * Fetches all NBA teams and filters them to only include East and West conference teams.
   * @returns A promise that resolves to an ApiResponse containing an array of NBATeam objects.
   * @throws NBAError if the API call fails or the response is not valid.
   */
  async getTeams(): Promise<ApiResponse<NBATeam[]>> {
    try {
      const teams = await this.api.nba.getTeams();
      const filteredTeams = teams.data.filter((t: NBATeam) => t.conference === 'East' || t.conference === 'West');
      return { data: filteredTeams};
    } catch(err) {
      throw new NBAError(
        'Failed to fetch NBA teams',
        'TEAMS_FETCH_ERROR',
        500,
      );
    }
  }

  /**
   * Fetches an NBA team by its ID.
   * @param teamId The ID of the team to fetch.
   * @returns A promise that resolves to an ApiResponse containing an NBATeam object.
   * @throws NBAError if the API call fails or the response is not valid.
   */
  async getTeamById(teamId: number): Promise<ApiResponse<NBATeam>> {
    try {
      const team = await this.api.nba.getTeam(teamId);
      return team;
    } catch(err) {
      throw new NBAError(
        `Failed to fetch NBA team with ID ${teamId}`,
        'TEAM_FETCH_ERROR',
        404,
        { teamId }
      );
    }
  }

  /**
   * Fetches NBA players for a given team ID.
   * @param teamId The ID of the team to fetch players for.
   * @returns A promise that resolves to an ApiResponse containing an array of NBAPlayer objects.
   * @throws NBAError if the API call fails or the response is not valid.
   */
  async getPlayersByTeamId(teamId: number): Promise<ApiResponse<NBAPlayer[]>> {
    try {
      const players = await this.api.nba.getPlayers({ team_ids: [teamId] });
      return players;
    } catch(err) {
      throw new NBAError(
        `Failed to fetch NBA players for team with ID ${teamId}`,
        'PLAYERS_FETCH_ERROR',
        404,
        { teamId }
      );
    }
  }
  
  /**
   * Fetches the team name and draft pick count for a given team ID (ex. 1, 2, null)
   * @param teamId The ID of the team to fetch draft pick count for.
   * @returns A promise that resolves to an object containing the team name and draft pick counts.
   * @throws NBAError if the API call fails or the response is not valid.
   */
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
      throw new NBAError(
        `Failed to fetch draft pick count for team with ID ${teamId}`,
        'DRAFT_PICKS_FETCH_ERROR',
        404,
        { teamId }
      );
    }
  }
}