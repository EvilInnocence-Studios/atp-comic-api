import { FieldRegistry } from "@core/express/util";
import { init } from "../comic/migrations/00-init";
import { migration as addArcCharacters } from "../comic/migrations/01-addArcCharacters";

export { apiConfig } from "./endpoints";

export const migrations = [init, addArcCharacters];
export const setupMigrations = [init];

FieldRegistry.register(
    "comicArcs", {
        create: ["name", "url", "parentId", "sortOrder", "enabled", "isVerticalScroll", "thumbnailUrl", "bannerUrl", "summary", "transcript", "postDate"],
        update: ["name", "url", "parentId", "sortOrder", "enabled", "isVerticalScroll", "thumbnailUrl", "bannerUrl", "summary", "transcript", "postDate"],
    }
);
FieldRegistry.register(
    "comicCharacters", {
        create: ["name", "thumbnailId", "mainImageId", "enabled", "showDetails", "sortOrder", "bio"],
        update: ["name", "thumbnailId", "mainImageId", "enabled", "showDetails", "sortOrder", "bio"],
    }
);
FieldRegistry.register(
    "comicCharacterAttributes", {
        create: ["characterId", "name", "value", "sortOrder"],
        update: ["name", "value", "sortOrder"],
    }
);
FieldRegistry.register(
    "comicCharacterMedia", {
        create: ["characterId", "url", "caption", "order"],
        update: ["url", "caption", "order"],
    }
);
FieldRegistry.register(
    "comicPages", {
        create: ["name", "url", "arcId", "sortOrder", "imageUrl", "transcript", "enabled", "postDate"],
        update: ["name", "url", "arcId", "sortOrder", "imageUrl", "transcript", "enabled", "postDate"],
    }
);
FieldRegistry.register(
    "comicPageCharacters", {
        create: ["pageId", "characterId"],
        update: [],
    }
);
FieldRegistry.register(
    "comicArcCharacters", {
        create: ["arcId", "characterId"],
        update: [],
    }
);
FieldRegistry.register(
    "comicPageCommentaries", {
        create: ["title", "text", "sortOrder"],
        update: ["title", "text", "sortOrder"],
    }
);
