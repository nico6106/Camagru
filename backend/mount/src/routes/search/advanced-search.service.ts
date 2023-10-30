import { GPSCoordinates, TableUser, TableUsersName } from '../../database/data';
import { Database } from '../../database/db';
import { Request, Response } from 'express';
import { getUserFromRequest } from '../auth/auth.service';
import { ErrorMsg, NotConnected, SuccessMsg } from '../../shared/errors';
import { MatchingGlobalData, MatchingResponse } from '../../shared/search';
import {
    MatchingUsers,
    computeRawDataForAnalysis,
    createResponse,
    createResponseGlobalData,
    normalizeResults,
    showResults,
} from './search.service';

type SearchOptions = {
    dist_min: number | '';
    dist_max: number | '';
    age_min: number | '';
    age_max: number | '';
    fame_min: number | '';
    fame_max: number | '';
    gender: 'female' | 'male' | 'Both';
    tags: string[];
    latitude: number | '';
    longitude: number | '';
};

export async function advancedSearch(
    db: Database,
    req: Request,
    res: Response,
) {
    const {
        dist_min,
        dist_max,
        age_min,
        age_max,
        fame_min,
        fame_max,
        gender,
        tags,
        latitude,
        longitude,
    } = req.body;
    const options: SearchOptions = {
        dist_min: dist_min,
        dist_max: dist_max,
        age_min: age_min,
        age_max: age_max,
        fame_min: fame_min,
        fame_max: fame_max,
        gender: gender,
        tags: tags,
        latitude: latitude,
        longitude: longitude,
    };

    const meUser: TableUser | null = await getUserFromRequest(db, req);
    if (!meUser)
        return res.status(200).json({ message: ErrorMsg, error: NotConnected });

    //get all users
    const allUsers: TableUser[] | null = await db.selectAllElemFromTable(
        TableUsersName,
    );
    if (!allUsers)
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'servor error' });

    //filter current user from results
    const allUsersExceptMe: TableUser[] | null = allUsers.filter(
        (elem) => elem.id !== meUser.id,
    );

    //filter blocked users
    const allUsersExceptBlocked: TableUser[] = allUsersExceptMe.filter(
        (elem) => !meUser.blocked_user.includes(elem.id),
    );

    //filter by gender preference
    let matchesBySexPref: TableUser[] = [];
    if (gender && (gender === 'female' || gender === 'male')) {
        matchesBySexPref = allUsersExceptBlocked.filter(
            (elem) => gender === elem.gender,
        );
    } else {
        matchesBySexPref = allUsersExceptBlocked;
    }

    const allDistances: number[] = [];
    const allNbTags: number[] = [];
    const allFame: number[] = [];

    const coordCurrUser: GPSCoordinates = {
        latitude: latitude ? latitude : meUser.position.latitude,
        longitude: longitude ? longitude : meUser.position.longitude,
    };

    //compute raw data for analysis
    const usersMatching: MatchingUsers[] = computeRawDataForAnalysis(
        meUser,
        matchesBySexPref,
        coordCurrUser,
        allDistances,
        allNbTags,
        allFame,
    );

    //normalize
    normalizeResults(usersMatching, allDistances, allNbTags, allFame);

    //log
    showResults(usersMatching);
    // console.log(options);

    const data: MatchingResponse[] = createResponse(usersMatching);

    //new filtering taking into account user requierements
    const response: MatchingResponse[] = filterResultsWithAdvancedSearch(
        data,
        options,
    );

    const global: MatchingGlobalData = createResponseGlobalData(
        response,
        allDistances,
    );

    //compute distance from other users and
    return res.status(200).json({
        message: SuccessMsg,
        data_search: response,
        data_global: global,
    });
}

function filterResultsWithAdvancedSearch(
    data: MatchingResponse[],
    options: SearchOptions,
): MatchingResponse[] {
    const response: MatchingResponse[] = [];

    for (const elem of data) {
        let saveElem: boolean = true;

        //filter
        //distance
        if (options.dist_min && !(elem.distance >= options.dist_min))
            saveElem = false;
        if (options.dist_max && !(elem.distance <= options.dist_max))
            saveElem = false;
        //age
        if (options.age_min && !(elem.user.age >= options.age_min))
            saveElem = false;
        if (options.age_max && !(elem.user.age <= options.age_max))
            saveElem = false;
        //fame
        if (options.fame_min && !(elem.user.fame_rating >= options.fame_min))
            saveElem = false;
        if (options.fame_max && !(elem.user.fame_rating <= options.fame_max))
            saveElem = false;
        //tags
        if (
            options.tags.length > 0 &&
            filterbyTags(elem.user.tags, options.tags)
        )
            saveElem = false;

        //save
        if (saveElem) {
            response.push(elem);
        }
    }
    return response;
}

function filterbyTags(tagsUser: string[], tagsFilter: string[]): boolean {
    for (const tag of tagsUser) {
        if (tagsFilter.includes(tag)) {
            return false;
        }
    }
    if (tagsFilter.includes('None') && tagsUser.length === 0) return false;
    return true;
}
