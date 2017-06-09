/* @flow weak */

import Database from "./metadata/Database";
import Action from "./Action";

import type { DatasetQuery } from "metabase/meta/types/Card";
import type Metadata from "metabase-lib/lib/metadata/Metadata";
import type Question from "metabase-lib/lib/Question";
import type { ActionClick } from "metabase-lib/lib/Action";
import { memoize } from "metabase-lib/lib/utils";

/**
 * An abstract class for all query types (StructuredQuery, NativeQuery and MultiQuery)
 */
export default class Query {
    _metadata: Metadata;

    /**
     * Note that Question is not always in sync with _datasetQuery,
     * calling question() will always merge the latest _datasetQuery to the question object
     */
    _originalQuestion: Question;
    _datasetQuery: DatasetQuery;

    constructor(question: Question, datasetQuery: DatasetQuery) {
        this._metadata = question._metadata;
        this._datasetQuery = datasetQuery;
        this._originalQuestion = question;
    }

    @memoize question(): Question {
        return this._originalQuestion.setQuery(this);
    }

    // TODO: Decide the behavior of isEditable for multimetric questions
    isEditable(): boolean {
        return true;
    }

    /**
     * Returns the dataset_query object underlying this Query
     */
    datasetQuery(): DatasetQuery {
        return this._datasetQuery;
    }

    /**
     * Query is valid (as far as we know) and can be executed
     */
    canRun(): boolean {
        return false;
    }

    /**
     * Databases this query could use
     */
    databases(): Database[] {
        return this._metadata.databasesList();
    }

    /**
     * Top level actions that can be performed on this query
     */
    actions(): Action[] {
        return [];
    }

    /**
     * Drill through actions that can be performed on a part of the result setParameter
     */
    actionsForClick(click: ActionClick): Action[] {
        return [];
    }

    /**
     * Helper for updating with functions that expect a DatasetQuery object
     */
    update(fn: (datasetQuery: DatasetQuery) => void) {
        return fn(this.datasetQuery());
    }
}
