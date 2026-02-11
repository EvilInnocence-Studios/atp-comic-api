import { setupMigrations as comicSetup } from "./migrations";

export {apiConfig} from "./endpoints";

export const migrations = [];
export const setupMigrations = comicSetup;
