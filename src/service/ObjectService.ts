import {type ErrorHandlers, request} from "../api.tsx";
import type { User} from '../types';
import type {AxiosResponse} from "axios";
import type {Team} from "../types/team.ts";

export async function createPerson(
    personData: User,
    successHandler?: (response: AxiosResponse<User>) => void,
    errorHandlers?: ErrorHandlers
): Promise<AxiosResponse<User> | void> {
    return request(
        'POST',
        '/v1/create-person',
        successHandler,
        errorHandlers,
        personData
    );
}

export async function getPersonInfoByEmail(
    email: string,
    successHandler?: (response: AxiosResponse<User>) => void,
    errorHandlers?: ErrorHandlers
): Promise<AxiosResponse<User> | void> {
    return request(
        'GET',
        `/v1/get-person-by-email/?email=${email}`,
        successHandler,
        errorHandlers
    );
}

export async function getTeamsByUserEmail(
    email: string,
    successHandler?: (response: AxiosResponse<Team[]>) => void,
    errorHandlers?: ErrorHandlers
): Promise<AxiosResponse<Team[]> | void> {
    return request(
        'GET',
        `/v1/get-team-by-email/?email=${email}`,
        successHandler,
        errorHandlers
    );
}

export async function getVisibleTeamsByUserEmail(
    email: string,
    successHandler?: (response: AxiosResponse<Team[]>) => void,
    errorHandlers?: ErrorHandlers
): Promise<AxiosResponse<Team[]> | void> {
    return request(
        'GET',
        `/v1/get-visible-team-by-email/?email=${email}`,
        successHandler,
        errorHandlers
    );
}


