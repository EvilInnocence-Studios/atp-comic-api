import { ICharacterAttribute, IComicCharacter } from "../../comic-shared/character/types";
import { Setting } from "../../common/setting/service";
import { basicCrudService } from "../../core/express/service/common";
import { optionalMediaService } from "../../core/express/service/media";
import { reorder } from "../../core/express/util";

const CharacterBasic = basicCrudService<IComicCharacter>("comicCharacters");

export const Character = {
    ...CharacterBasic,
    thumbnail: optionalMediaService<IComicCharacter>({
        dbTable: "comicCharacters",
        mediaColumn: "imageUrl",
        getFolder: () => Setting.get("comicMediaFolder"),
        getEntity: CharacterBasic.loadById,
        getFileName: (character:IComicCharacter) => character.imageUrl,
    }),
    attributes: basicCrudService<ICharacterAttribute>("comicCharacterAttributes"),
    sort: async (characterId: string, newIndex: string):Promise<IComicCharacter[]> => {
        await reorder("comicCharacters", characterId, newIndex, {});
        return await CharacterBasic.search({});
    }
}