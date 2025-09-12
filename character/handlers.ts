import { pipeTo } from "ts-functional";
import { ICharacterAttribute, IComicCharacter, NewCharacterAttribute, NewComicCharacter } from "../../comic-shared/character/types";
import { Query } from "../../core-shared/express/types";
import { getBody, getBodyParam, getFile, getParam, getParamsAndBody } from "../../core/express/extractors";
import { HandlerArgs } from "../../core/express/types";
import { CheckPermissions } from "../../uac/permission/util";
import { Character } from "./services";

class CharacterHandlerClass {
    @CheckPermissions("character.view")
    public search (...args:HandlerArgs<Query>):Promise<IComicCharacter[]> {
        return pipeTo(Character.search, getBody<Query>)(args);
    }

    @CheckPermissions("character.view")
    public get (...args:HandlerArgs<undefined>):Promise<IComicCharacter> {
        return pipeTo(Character.loadById, getParam("characterId"))(args);
    }

    @CheckPermissions("character.update")
    public update (...args:HandlerArgs<Partial<IComicCharacter>>):Promise<IComicCharacter> {
        return pipeTo(Character.update, getParam("characterId"), getBody<Partial<IComicCharacter>>)(args);
    }

    @CheckPermissions("character.update")
    public replaceImage (...args:HandlerArgs<Partial<IComicCharacter>>):Promise<IComicCharacter> {
        return pipeTo(Character.thumbnail.replace, getParam("characterId"), getFile)(args);
    }

    @CheckPermissions("character.update")
    public removeImage (...args:HandlerArgs<undefined>):Promise<any> {
        return pipeTo(Character.thumbnail.remove, getParam("characterId"))(args);
    }

    @CheckPermissions("character.delete")
    public remove (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(Character.remove, getParam("characterId"))(args);
    }

    @CheckPermissions("character.create")
    public create (...args:HandlerArgs<NewComicCharacter>):Promise<IComicCharacter> {
        return pipeTo(Character.create, getBody<NewComicCharacter>)(args);
    }

    @CheckPermissions("character.view")
    public searchAttributes (...args:HandlerArgs<Query>):Promise<ICharacterAttribute[]> {
        return pipeTo(Character.attributes.search, getParamsAndBody)(args);
    }

    @CheckPermissions("character.update")
    public addAttribute (...args:HandlerArgs<NewCharacterAttribute>):Promise<ICharacterAttribute> {
        return pipeTo(Character.attributes.create, getParamsAndBody)(args);
    }

    @CheckPermissions("character.update")
    public updateAttribute (...args:HandlerArgs<Partial<ICharacterAttribute>>):Promise<ICharacterAttribute> {
        return pipeTo(Character.attributes.update, getParam("attributeId"), getBody<Partial<ICharacterAttribute>>)(args);
    }

    @CheckPermissions("character.update")
    public removeAttribute (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(Character.attributes.remove, getParam("attributeId"))(args);
    }

    @CheckPermissions("character.update")
    public sort (...args:HandlerArgs<{characterId: string, newIndex: string}>):Promise<IComicCharacter[]> {
        return pipeTo(Character.sort, getBodyParam("characterId"), getBodyParam("newIndex"))(args);
    }
}

export const CharacterHandler = new CharacterHandlerClass();