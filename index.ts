import { FieldRegistry } from "@core/express/util";
import { init } from "../comic/migrations/00-init";
import { migration as addArcCharacters } from "../comic/migrations/01-addArcCharacters";

export { apiConfig } from "./endpoints";

export const migrations = [init, addArcCharacters];
export const setupMigrations = [init];

FieldRegistry.register(
    "comicArcs",
    ["name", "url", "parentId", "sortOrder", "enabled", "isVerticalScroll", "thumbnailUrl", "bannerUrl", "summary", "transcript", "postDate"]
);
FieldRegistry.register(
    "comicCharacters",
    ["name", "thumbnailId", "mainImageId", "enabled", "showDetails", "sortOrder", "bio"]
);
FieldRegistry.register(
    "comicCharacterAttributes",
    ["name", "value", "sortOrder"]
);
FieldRegistry.register(
    "comicCharacterMedia",
    ["url", "caption", "order"]
);
FieldRegistry.register(
    "comicPages",
    ["name", "url", "arcId", "sortOrder", "imageUrl", "transcript", "enabled", "postDate"]
);
FieldRegistry.register(
    "comicPageCharacters",
    []
);
FieldRegistry.register(
    "comicPageCommentaries",
    ["title", "text", "sortOrder"]
);
