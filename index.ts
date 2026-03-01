import { init } from "./migrations/00-init";
import { migration as addArcCharacters } from "./migrations/01-addArcCharacters";

export { apiConfig } from "./endpoints";

export const migrations = [init, addArcCharacters];
export const setupMigrations = [init];
