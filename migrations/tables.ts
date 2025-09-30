import { Knex } from "knex";

export const arcsTable = (t:Knex.CreateTableBuilder) => {
    t.bigIncrements();
    t.string("name", 255).notNullable();
    t.string("url", 255).nullable().unique();
    t.bigInteger("parentId").unsigned().references("comicArcs.id").onDelete("SET NULL").nullable();
    t.smallint("sortOrder").notNullable().defaultTo(0);
    t.boolean("enabled").notNullable().defaultTo(false);
    t.string("thumbnailUrl").nullable();
    t.string("bannerUrl").nullable();
    t.text("summary").nullable();
};

export const charactersTable = (t:Knex.CreateTableBuilder) => {
    t.bigIncrements();
    t.string("name", 255).notNullable().unique();
    t.string("imageUrl").nullable();
    t.smallint("sortOrder").notNullable().defaultTo(0);
    t.text("bio").nullable();
}

export const characterAttributesTable = (t:Knex.CreateTableBuilder) => {
    t.bigIncrements();
    t.bigInteger("characterId").unsigned().notNullable().references("comicCharacters.id").onDelete("CASCADE");
    t.string("name", 255).notNullable();
    t.string("value", 255).notNullable();
    t.smallint("sortOrder").notNullable().defaultTo(0);
    t.unique(["characterId", "name"]);
}

export const pagesTable = (t:Knex.CreateTableBuilder) => {
    t.bigIncrements();
    t.string("name", 255).notNullable();
    t.string("url", 255).nullable().unique();
    t.bigInteger("arcId").notNullable();
    t.smallint("sortOrder").notNullable().defaultTo(0);
    t.string("imageUrl").nullable();
    t.text("transcript").nullable();
    t.boolean("enabled").notNullable().defaultTo(false);
    t.date("postDate").nullable();
}

export const pageCommentaryTable = (t:Knex.CreateTableBuilder) => {
    t.bigIncrements();
    t.bigInteger("pageId").unsigned().notNullable().references("comicPages.id").onDelete("CASCADE");
    t.bigInteger("userId").unsigned().notNullable().references("users.id").onDelete("CASCADE");
    t.string("title").nullable();
    t.text("text").notNullable();
    t.smallint("sortOrder").notNullable().defaultTo(0);
}

export const pageCharactersTable = (t:Knex.CreateTableBuilder) => {
    t.bigIncrements();
    t.bigInteger("pageId").unsigned().notNullable().references("comicPages.id").onDelete("CASCADE");
    t.bigInteger("characterId").unsigned().notNullable().references("comicCharacters.id").onDelete("CASCADE");
    t.unique(["pageId", "characterId"]);
}
