import { IApiConfig } from "../core/endpoints";
import { ArcEndpoints } from "./arc/endpoints";
import { CharacterEndpoints } from "./character/endpoints";
import { PageEndpoints } from "./page/endpoints";

export const apiConfig:IApiConfig = {
    ...ArcEndpoints,
    ...CharacterEndpoints,
    ...PageEndpoints,
}