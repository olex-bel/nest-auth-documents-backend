
import { SelectQueryBuilder } from 'typeorm';

export function createPaginatedQuery<T>(
    queryBuilder: SelectQueryBuilder<T>,
    limit: number,
    currentCursor: string,
    cursorField: string
): SelectQueryBuilder<T> {
    if (currentCursor) {
        queryBuilder.andWhere(`${cursorField} > :currentCursor`, { currentCursor });
    }

    return queryBuilder.orderBy(cursorField, 'ASC').limit(limit);
}

export async function paginateResults<T>(
    queryBuilder: SelectQueryBuilder<T>,
    limit: number,
    currentCursor: string,
    cursorField: string,
    rawResults: boolean = true
) {
    const fetchLimit = limit + 1;
    const query = createPaginatedQuery(queryBuilder, fetchLimit, currentCursor, cursorField);
    const results = rawResults ? await query.getRawMany() : await query.getMany();
    const paginationResult = {
        items: [],
        newCursor: null,
    };

    if (results.length === fetchLimit) {
        paginationResult.items = results.slice(0, limit);
        paginationResult.newCursor = results[limit - 1][cursorField];
    } else {
        paginationResult.items = results;
    }

    return paginationResult;
}
