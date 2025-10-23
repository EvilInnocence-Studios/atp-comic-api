import { IFile, removeMedia, uploadMedia } from "../../core/s3Uploads";
import { ICharacterAttribute, ICharacterMedia, IComicCharacter } from "../../comic-shared/character/types";
import { Setting } from "../../common/setting/service";
import { basicCrudService } from "../../core/express/service/common";
import { optionalMediaService } from "../../core/express/service/media";
import { reorder } from "../../core/express/util";
import { database } from "../../core/database";

const db = database();

const CharacterBasic = basicCrudService<IComicCharacter>("comicCharacters");

const mediaFolder = () => Setting.get("comicMediaFolder");

export const Character = {
    ...CharacterBasic,
    pages: (characterId: string):Promise<string[]> => {
        return db("comicPages")
            .join("comicPageCharacters", "comicPages.id", "comicPageCharacters.pageId")
            .where("comicPageCharacters.characterId", characterId)
            .where("comicPages.enabled", true)
            .select("comicPages.id as id")
            .orderBy("comicPages.sortOrder", "asc")
            .then(rows => rows.map(r => r.id));
    },
    attributes: {
        ...basicCrudService<ICharacterAttribute>("comicCharacterAttributes"),
        sort: async (characterId: string, attributeId:string, newIndex: string):Promise<ICharacterAttribute[]> => {
            await reorder("comicCharacterAttributes", attributeId, newIndex, {characterId}, "sortOrder");
            return await Character.attributes.search({});
        },
    },
    sort: async (characterId: string, newIndex: string):Promise<IComicCharacter[]> => {
        await reorder("comicCharacters", characterId, newIndex, {}, "sortOrder");
        return await CharacterBasic.search({});
    },
    media: {
        ...basicCrudService<ICharacterMedia>("comicCharacterMedia", "url"),
        upload: async (characterId: number, file: IFile):Promise<ICharacterMedia> => {
            // Upload file to S3
            uploadMedia(await mediaFolder() + `/${characterId}`, file);

            // Create record in database
            // If the characterId and url unique key already exists, just return the existing record instead
            const [newMedia] = await db("comicCharacterMedia")
                .insert({ characterId, url: file.name, caption: file.name }, "*")
                .onConflict(["characterId", "url"]).ignore();
            return newMedia;
        },
        remove: async (characterId: number, mediaId: string):Promise<null> => {
            const media:ICharacterMedia = await Character.media.loadById(mediaId);

            // Remove file from S3
            await removeMedia(await mediaFolder() + `/${characterId}`, media.url);

            // Remove record from database
            await db("comicCharacterMedia").where({ id: mediaId }).delete();

            return null;
        },
        sort: async (characterId: number, {id, newIndex}:{id: string, newIndex: string}):Promise<ICharacterMedia[]> => {
            await reorder("comicCharacterMedia", id, newIndex, { characterId });
            return await Character.media.search({ characterId });
        },
    },
}
