import { init } from "../comic/migrations/00-init";
import { migration as addArcCharacters } from "../comic/migrations/01-addArcCharacters";

export { apiConfig } from "./endpoints";

export const migrations = [init, addArcCharacters];
export const setupMigrations = [init];
