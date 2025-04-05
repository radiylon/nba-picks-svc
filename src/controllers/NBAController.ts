import { Request, Response, NextFunction } from "express";
import NBAService from "../services/NBAService";

export default class NBAController {
  constructor(
    private nbaService: NBAService = new NBAService(),
  ) {}

  getDraftPickCountByTeamId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { teamId } = req.params;
      const numericTeamId = Number(teamId);
      
      if (isNaN(numericTeamId)) {
        const error = new Error('Invalid team ID. Team ID must be a number.') as any;
        error.status = 400;
        throw error;
      }

      const result = await this.nbaService.getDraftPickCountByTeamId(numericTeamId);
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  };
}
