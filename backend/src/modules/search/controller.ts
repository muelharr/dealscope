import { Request, Response } from 'express';
import { SearchService } from './service';
import { sendSuccess, sendError } from '../../shared/utils/response';
import { SearchQueryFilters } from './types';

const searchService = new SearchService();

export class SearchController {
  public search = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = req.query as unknown as SearchQueryFilters;
      const { data, meta } = await searchService.search(filters, req.user?.userId);
      sendSuccess(res, data, 200, meta);
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };
}
