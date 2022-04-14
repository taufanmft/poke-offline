import { useQuery } from '@apollo/client';
import type { OperationVariables, QueryResult } from '@apollo/client';

export interface QueryResultExtend<TData, TVariables> extends QueryResult<TData, TVariables> {
    // fallback: boolean;
    // fallbackCreatedAt: string;
    status: string;
}

export type UseQuery = Parameters<typeof useQuery>;

export type DocumentNode = UseQuery[0];

export type CustomChecker<TData = OperationVariables, TVariables = OperationVariables> = (
    queryResult: QueryResult<TData, TVariables> | null,
) => boolean;
