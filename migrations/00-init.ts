import { insertSettings } from "@common/migrations/util";
import { database } from "../../core/database";
import { IMigration } from "../../core/dbMigrations";
import { insertPermissions, insertRolePermissions } from "../../uac/migrations/util";
import {
    arcCharactersTable,
    arcsTable,
    characterAttributesTable, characterMediaTable,
    charactersTable, pageCharactersTable, pageCommentaryTable, pagesTable
} from "./tables";

const db = database();

const permissions = [
    { name: "comicPage.create", description: "Can create comic pages" },
    { name: "comicPage.view", description: "Can view comic pages" },
    { name: "comicPage.update", description: "Can edit comic pages" },
    { name: "comicPage.delete", description: "Can delete comic pages" },
    { name: "comicPage.disabled", description: "Can view disabled pages" },

    { name: "comicArc.create", description: "Can create comic arcs" },
    { name: "comicArc.view", description: "Can view comic arcs" },
    { name: "comicArc.update", description: "Can edit comic arcs" },
    { name: "comicArc.delete", description: "Can delete comic arcs" },
    { name: "comicArc.disabled", description: "Can view disabled arcs" },

    { name: "comicCharacter.create", description: "Can create comic characters" },
    { name: "comicCharacter.view", description: "Can view comic characters" },
    { name: "comicCharacter.update", description: "Can edit comic characters" },
    { name: "comicCharacter.delete", description: "Can delete comic characters" },

    { name: "comicCommentary.create", description: "Can create comic page commentary" },
    { name: "comicCommentary.view", description: "Can view comic page commentary" },
    { name: "comicCommentary.update", description: "Can edit comic page commentary" },
    { name: "comicCommentary.delete", description: "Can delete comic page commentary" },
];

const rolePermissions = [
    ...permissions.map(p => ({ roleName: "SuperUser", permissionName: p.name })),
    ...permissions.filter(p => p.name.endsWith(".view")).map(p => ({ roleName: "Public", permissionName: p.name })),
];

const settings = [
    {key: "comicMediaFolder",                 value: "media/comics"},
    {key: "comic.arcNames",                   value: "Series,Book,Chapter"},
    {key: "comic.showArchiveDetails",         value: "false"},
    {key: "comic.archivesSortOrder",          value: "desc"},
    {key: "comic.showArchiveSortOrderToggle", value: "false"},
    {key: "comic.archiveBreadCrumbMode",      value: "parent"},
    {key: "comic.showArchiveViewModeToggle",  value: "false"},
    {key: "comic.showArchiveBanner",          value: "false"},
    {key: "comic.defaultArchiveView",         value: "list"},
    {key: "comic.defaultArchivesSortOrder",   value: "desc"},
    {key: "comic.ArchiveLinkLevel",           value: "0"},
    {key: "comic.verticalScrollArcNames",     value: "Series,Season,Episode"},
]

export const init: IMigration = {
    name: "init",
    module: "comic",
    description: "Initial data for comic module",
    version: "1.0.0",
    order: 2,
    down: () => db.schema
        .dropTableIfExists("comicPageCharacters")
        .dropTableIfExists("comicArcCharacters")
        .dropTableIfExists("comicPageCommentaries")
        .dropTableIfExists("comicPages")
        .dropTableIfExists("comicCharacterAttributes")
        .dropTableIfExists("comicCharacterMedia")
        .dropTableIfExists("comicCharacters")
        .dropTableIfExists("comicArcs"),
    up: () => db.schema
        .createTable("comicArcs", arcsTable)
        .createTable("comicCharacters", charactersTable)
        .createTable("comicCharacterAttributes", characterAttributesTable)
        .createTable("comicCharacterMedia", characterMediaTable)
        .createTable("comicPages", pagesTable)
        .createTable("comicPageCommentaries", pageCommentaryTable)
        .createTable("comicPageCharacters", pageCharactersTable)
        .createTable("comicArcCharacters", arcCharactersTable),
    initData: async () => {
        await insertPermissions(db, permissions);
        await insertRolePermissions(db, rolePermissions);
        await insertSettings(db, settings);
    }
}