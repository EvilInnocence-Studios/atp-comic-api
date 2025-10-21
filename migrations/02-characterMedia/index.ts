import { database } from "../../../core/database";
import { IMigration } from "../../../core/dbMigrations";
import { characterMediaTable } from "../tables";

const db = database();

export const addMedia:IMigration = {
    name: "add-comic-character-media",
    module: "comic",
    description: "Add comic character media table",
    order: 0,
    down: () => db.schema
        .dropTableIfExists("comicCharacterMedia"),
    up: () => db.schema
        .createTable("comicCharacterMedia", characterMediaTable),
    initData: async () => Promise.resolve(null),
}