import { pipeTo } from "ts-functional";
import { ICharacterAttribute, ICharacterMedia, IComicCharacter, NewCharacterAttribute, NewComicCharacter } from "../../comic-shared/character/types";
import { Query } from "../../core-shared/express/types";
import { getBody, getBodyParam, getFile, getParam, getParams, getParamsAndBody } from "../../core/express/extractors";
import { HandlerArgs } from "../../core/express/types";
import { CheckPermissions } from "../../uac/permission/util";
import { Character } from "./services";

class CharacterHandlerClass {
    @CheckPermissions("comicCharacter.view")
    public search (...args:HandlerArgs<Query>):Promise<IComicCharacter[]> {
        return pipeTo(Character.search, getBody<Query>)(args);
    }

    @CheckPermissions("comicCharacter.view")
    public get (...args:HandlerArgs<undefined>):Promise<IComicCharacter> {
        return pipeTo(Character.loadById, getParam("characterId"))(args);
    }

    @CheckPermissions("comicCharacter.update")
    public update (...args:HandlerArgs<Partial<IComicCharacter>>):Promise<IComicCharacter> {
        return pipeTo(Character.update, getParam("characterId"), getBody<Partial<IComicCharacter>>)(args);
    }

    @CheckPermissions("comicCharacter.delete")
    public remove (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(Character.remove, getParam("characterId"))(args);
    }

    @CheckPermissions("comicCharacter.create")
    public create (...args:HandlerArgs<NewComicCharacter>):Promise<IComicCharacter> {
        return pipeTo(Character.create, getBody<NewComicCharacter>)(args);
    }

    @CheckPermissions("comicCharacter.view")
    public searchAttributes (...args:HandlerArgs<Query>):Promise<ICharacterAttribute[]> {
        return pipeTo(Character.attributes.search, getParamsAndBody)(args);
    }

    @CheckPermissions("comicCharacter.update")
    public addAttribute (...args:HandlerArgs<NewCharacterAttribute>):Promise<ICharacterAttribute> {
        return pipeTo(Character.attributes.create, getParamsAndBody)(args);
    }

    @CheckPermissions("comicCharacter.update")
    public updateAttribute (...args:HandlerArgs<Partial<ICharacterAttribute>>):Promise<ICharacterAttribute> {
        return pipeTo(Character.attributes.update, getParam("attributeId"), getBody<Partial<ICharacterAttribute>>)(args);
    }

    @CheckPermissions("comicCharacter.update")
    public removeAttribute (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(Character.attributes.remove, getParam("attributeId"))(args);
    }

    @CheckPermissions("comicCharacter.update")
    public sortAttributes (...args:HandlerArgs<Query>):Promise<ICharacterAttribute[]> {
        return pipeTo(Character.attributes.sort, getParam("characterId"), getBodyParam("attributeId"), getBodyParam("newIndex"))(args);
    }

    @CheckPermissions("comicCharacter.update")
    public sort (...args:HandlerArgs<{characterId: string, newIndex: string}>):Promise<IComicCharacter[]> {
        return pipeTo(Character.sort, getBodyParam("characterId"), getBodyParam("newIndex"))(args);
    }

    @CheckPermissions("comicCharacter.view")
    public getMedia (...args:HandlerArgs<Query>):Promise<ICharacterMedia[]> {
        return pipeTo(Character.media.search, getParams)(args);
    }

    @CheckPermissions("comicCharacter.view")
    public getOneMedia (...args:HandlerArgs<Query>):Promise<ICharacterMedia> {
        return pipeTo(Character.media.loadById, getParam("mediaId"))(args);
    }

    @CheckPermissions("comicCharacter.update")
    public addMedia (...args:HandlerArgs<Partial<any>>):Promise<ICharacterMedia> {
        return pipeTo(Character.media.upload, getParam("characterId"), getFile)(args);
    }

    @CheckPermissions("comicCharacter.update")
    public updateMedia (...args:HandlerArgs<Partial<any>>):Promise<any> {
        return pipeTo(Character.media.update, getParam("mediaId"), getBody)(args);
    }

    @CheckPermissions("comicCharacter.delete")
    public removeMedia (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(Character.media.remove, getParam("characterId"), getParam("mediaId"))(args);
    }

    @CheckPermissions("comicCharacter.update")
    public sortMedia (...args:HandlerArgs<Query>):Promise<any> {
        return pipeTo(Character.media.sort, getParam("characterId"), getBody)(args);
    }
}

export const CharacterHandler = new CharacterHandlerClass();