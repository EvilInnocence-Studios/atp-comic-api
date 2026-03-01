import { database } from "../../core/database";
import { IMigration } from "../../core/dbMigrations";
import { arcCharactersTable } from "./tables";

const db = database();

export const migration: IMigration = {
    name: "addArcCharacters",
    module: "comic",
    description: "Add arc characters table",
    order: 1,
    version: "1.0.0",
    up: async () => {
        await db.schema.createTable("comicArcCharacters", arcCharactersTable);
    },
    down: async () => {
        await db.schema.dropTable("comicArcCharacters");
    },
    initData: async () => {
    }
}