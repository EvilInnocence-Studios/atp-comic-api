import { database } from "../../../core/database";
import { IMigration } from "../../../core/dbMigrations";
import {Arc} from "../../arc/services";
import {Page} from "../../page/services";
import {Character} from "../../character/services";
import { NewComicArc } from "src/comic-shared/arc/types";
import { Setting } from "../../../common/setting/service";
import { uploadMedia } from "../../../core/s3Uploads";
import { readFileSync } from "fs";

import arcData from "../../../../_data/arcs.json";
import characterData from "../../../../_data/characters.json";
import pageData from "../../../../_data/pages.json";
import mediaData from "../../../../_data/media.json";
import { NewComicCharacter } from "src/comic-shared/character/types";
import { NewComicPage } from "src/comic-shared/page/types";

const db = database();

const uploadArcMedia = true;
const uploadPageMedia = true;

export const refreshData:IMigration = {
    name: "refresh-comic-data",
    module: "comic",
    description: "Refresh comic module data",
    order: 1,
    down: async () => {
    },
    up: async () => {
        // Clear out existing data
        await db.raw('DELETE FROM "comicCharacterAttributes"');
        await db.raw('DELETE FROM "comicPageCharacters"');
        await db.raw('DELETE FROM "comicPageCommentaries"');
        await db.raw('DELETE FROM "comicPages"');
        await db.raw('DELETE FROM "comicCharacters"');
        await db.raw('DELETE FROM "comicArcs"');

        // Import arc data using the Arc.create function.  Create a mapping of old ID to new ID and update the parentId columns accordingly
        // Get the thumbnail and banner media from mediaData using the arc's thumbnailFileId and bannerFileId to find the media with the matching fileName
        const arcIdMap: Record<string, string> = {};
        for(const arc of arcData) {
            const {id, thumbnailFileId, bannerFileId, ...arcWithoutId} = arc;
            const newArc:NewComicArc = {...arcWithoutId, thumbnailUrl: null, bannerUrl: null, parentId: null};
            if(arc.thumbnailFileId) {
                const media = mediaData.find(m => m.id === arc.thumbnailFileId);
                if(media) {
                    const fullFileName = media.s3Prefix ? `${media.s3Prefix} - ${media.fileName}.${media.fileExtension}` : `${media.fileName}.${media.fileExtension}`;
                    newArc.thumbnailUrl = fullFileName;
                }
            }
            if(arc.bannerFileId) {
                const media = mediaData.find(m => m.id === arc.bannerFileId);
                if(media) {
                    const fullFileName = media.s3Prefix ? `${media.s3Prefix} - ${media.fileName}.${media.fileExtension}` : `${media.fileName}.${media.fileExtension}`;
                    newArc.bannerUrl = fullFileName;
                }
            }
            const createdArc = await Arc.create(newArc);
            arcIdMap[`${id}`] = createdArc.id;
        }

        // Update the parentId columns
        for(const oldArcId in arcIdMap) {
            const newArcId = arcIdMap[oldArcId];
            const oldArc = arcData.find(a => a.id.toString() === oldArcId);
            if(oldArc && oldArc.parentId) {
                const newParentId = arcIdMap[oldArc.parentId];
                await Arc.update(newArcId, {parentId: newParentId});
            }
        }

        // Get the media upload folder
        // const folder = "media/comics";
        const folder = await Setting.get("comicMediaFolder");

        // Upload the arc images to S3 in the correct folder
        if(uploadArcMedia) {
            for(const arc of await Arc.search({})) {
                if(arc.thumbnailUrl) {
                    console.log("Uploading thumbnail for arc", arc.name, arc.thumbnailUrl);
                    const data = readFileSync(`./_data/media/${arc.thumbnailUrl}`);
                    await uploadMedia(folder, {
                        data,
                        name: arc.thumbnailUrl,
                    }, {skipExisting: true});
                }
                if(arc.bannerUrl) {
                    console.log("Uploading banner for arc", arc.name, arc.bannerUrl);
                    const data = readFileSync(`./_data/media/${arc.bannerUrl}`);
                    await uploadMedia(folder, {
                        data,
                        name: arc.bannerUrl,
                    }, {skipExisting: true});
                }
            }
        }

        // Import character data using the Character.create function. Create an id map of old ID to new ID
        // Ignore all character data other than id and name
        const characterIdMap: Record<string, string> = {};
        for(const character of characterData) {
            const {id, name} = character;
            const newCharacter:NewComicCharacter = {name, imageUrl: null, sortOrder: 0, bio: null};
            const createdCharacter = await Character.create(newCharacter);
            characterIdMap[`${id}`] = createdCharacter.id;
        }

        // Import page data using the Page.create function.  Update the arcId column using the arcIdMap. Create a mapping of old ID to new ID for pages as well
        // Get the image media from mediaData using the page's imageId to find the media with the matching fileName
        const pageIdMap: Record<string, string> = {};
        for(const page of pageData) {
            const {id, arcId, imageId, characters, commentaries, version, ...pageWithoutId} = page;
            const newPage:NewComicPage = {...pageWithoutId, arcId: arcIdMap[`${arcId}`], imageUrl: null};
            if(imageId) {
                const media = mediaData.find(m => m.id === imageId);
                if(media) {
                    const fullFileName = media.s3Prefix ? `${media.s3Prefix} - ${media.fileName}.${media.fileExtension}` : `${media.fileName}.${media.fileExtension}`;
                    newPage.imageUrl = fullFileName;
                }
            }
            const createdPage = await Page.create(newPage);
            pageIdMap[`${id}`] = createdPage.id;

            // Now add the characters to the page using the characterIdMap to update the characterId column
            if(characters && characters.length) {
                for(const oldCharacterId of characters) {
                    const newCharacterId = characterIdMap[oldCharacterId];
                    if(newCharacterId) {
                        await Page.character.add(createdPage.id, newCharacterId);
                    }
                }
            }
        }

        // Upload the page images to S3 in the correct folder
        if(uploadPageMedia) {
            for(const page of await Page.search({})) {
                if(page.imageUrl) {
                    console.log("Uploading image for page", page.name, page.imageUrl);
                    const data = readFileSync(`./_data/media/${page.imageUrl}`);
                    await uploadMedia(folder, {
                        data,
                        name: page.imageUrl,
                    }, {skipExisting: true});
                }
            }
        }
    },
    initData: async () => {

    }
}




