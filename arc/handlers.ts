import { CheckPermissions } from "../../uac/permission/util";
import { pipeTo } from "ts-functional";
import { Arc } from "./services";
import { getBody, getBodyParam, getFile, getParam, getUserPermissions } from "../../core/express/extractors";
import { IComicArc, NewComicArc } from "src/comic-shared/arc/types";
import { HandlerArgs } from "../../core/express/types";
import { Query } from "../../core-shared/express/types";
import { IComicCharacter } from "src/comic-shared/character/types";

class ArcHandlerClass {
    @CheckPermissions("comicArc.create")
    public create(...args: HandlerArgs<NewComicArc>): Promise<IComicArc> {
        return pipeTo(Arc.create, getBody<NewComicArc>)(args);
    }

    @CheckPermissions("comicArc.view")
    public search(...args: HandlerArgs<Query>): Promise<IComicArc[]> {
        return pipeTo(Arc.search, getBody<Query>, getUserPermissions)(args);
    }

    @CheckPermissions("comicArc.view")
    public get(...args: HandlerArgs<undefined>): Promise<IComicArc> {
        return pipeTo(Arc.loadById, getParam("arcId"))(args);
    }

    @CheckPermissions("comicArc.update")
    public update(...args: HandlerArgs<Partial<IComicArc>>): Promise<IComicArc> {
        return pipeTo(Arc.update, getParam("arcId"), getBody<Partial<IComicArc>>)(args);
    }

    @CheckPermissions("comicArc.delete")
    public remove(...args: HandlerArgs<undefined>): Promise<null> {
        return pipeTo(Arc.remove, getParam("arcId"))(args);
    }

    @CheckPermissions("comicArc.update")
    public sort(...args: HandlerArgs<{ newIndex: string, arcId: string }>): Promise<IComicArc[]> {
        return pipeTo(Arc.sort, getParam("arcId"), getBodyParam("childArcId"), getBodyParam("newIndex"), getUserPermissions)(args);
    }

    @CheckPermissions("comicArc.update")
    public replaceThumbnail(...args: HandlerArgs<Partial<IComicArc>>): Promise<IComicArc> {
        return pipeTo(Arc.thumbnail.replace, getParam("arcId"), getFile)(args);
    }

    @CheckPermissions("comicArc.update")
    public removeThumbnail(...args: HandlerArgs<undefined>): Promise<any> {
        return pipeTo(Arc.thumbnail.remove, getParam("arcId"))(args);
    }

    @CheckPermissions("comicArc.update")
    public replaceBanner(...args: HandlerArgs<Partial<IComicArc>>): Promise<IComicArc> {
        return pipeTo(Arc.banner.replace, getParam("arcId"), getFile)(args);
    }

    @CheckPermissions("comicArc.update")
    public removeBanner(...args: HandlerArgs<undefined>): Promise<any> {
        return pipeTo(Arc.banner.remove, getParam("arcId"))(args);
    }

    @CheckPermissions("comicArc.view")
    public getCharacters(...args: HandlerArgs<undefined>): Promise<IComicCharacter[]> {
        return pipeTo(Arc.character.get, getParam("arcId"))(args);
    }

    @CheckPermissions("comicArc.update")
    public addCharacter(...args: HandlerArgs<undefined>): Promise<IComicArc> {
        return pipeTo(Arc.character.add, getParam("arcId"), getBodyParam("characterId"))(args);
    }

    @CheckPermissions("comicArc.update")
    public removeCharacter(...args: HandlerArgs<undefined>): Promise<null> {
        return pipeTo(Arc.character.remove, getParam("arcId"), getParam("characterId"))(args);
    }
}

export const ArcHandlers = new ArcHandlerClass();