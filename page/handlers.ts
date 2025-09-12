import { IComicPage, IComicPageCommentary, NewComicPage } from "src/comic-shared/page/types";
import { pipeTo } from "ts-functional";
import { IComicCharacter } from "../../comic-shared/character/types";
import { Query } from "../../core-shared/express/types";
import { getBody, getBodyParam, getFile, getParam, getParamsAndBody } from "../../core/express/extractors";
import { HandlerArgs } from "../../core/express/types";
import { CheckPermissions } from "../../uac/permission/util";
import { Page } from "./services";

class PageHandlerClass {
    @CheckPermissions("page.view")
    public search (...args:HandlerArgs<Query>):Promise<IComicPage[]> {
        return pipeTo(Page.search, getBody<Query>)(args);
    }

    @CheckPermissions("page.view")
    public get (...args:HandlerArgs<undefined>):Promise<IComicPage> {
        return pipeTo(Page.loadById, getParam("pageId"))(args);
    }

    @CheckPermissions("page.update")
    public update (...args:HandlerArgs<Partial<IComicPage>>):Promise<IComicPage> {
        return pipeTo(Page.update, getParam("pageId"), getBody<Partial<IComicPage>>)(args);
    }

    @CheckPermissions("page.delete")
    public remove (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(Page.remove, getParam("pageId"))(args);
    }

    @CheckPermissions("page.create")
    public create (...args:HandlerArgs<NewComicPage>):Promise<IComicPage> {
        return pipeTo(Page.create, getBody<NewComicPage>)(args);
    }

    @CheckPermissions("page.update")
    public sort (...args:HandlerArgs<{newIndex: string, pageId: string}>):Promise<IComicPage[]> {
        return pipeTo(Page.sort, getBodyParam("arcId"), getParam("pageId"), getBodyParam("newIndex"))(args);
    }

    @CheckPermissions("page.update")
    public addCharacter (...args:HandlerArgs<{characterId: string}>):Promise<any> {
        return pipeTo(Page.character.add, getParam("pageId"), getBodyParam("characterId"))(args);
    }

    @CheckPermissions("page.update")
    public removeCharacter (...args:HandlerArgs<undefined>):Promise<any> {
        return pipeTo(Page.character.remove, getParam("pageId"), getParam("characterId"))(args);
    }

    @CheckPermissions("page.view")
    public getCharacters (...args:HandlerArgs<undefined>):Promise<IComicCharacter[]> {
        return pipeTo(Page.character.get, getParam("pageId"))(args);
    }

    @CheckPermissions("page.view")
    public getCommentaries (...args:HandlerArgs<undefined>):Promise<IComicPageCommentary[]> {
        return pipeTo(Page.commentary.search, getParamsAndBody)(args);
    }

    @CheckPermissions("page.update")
    public addCommentary (...args:HandlerArgs<Partial<IComicPageCommentary>>):Promise<IComicPageCommentary> {
        return pipeTo(Page.commentary.create, getParamsAndBody)(args);
    }

    @CheckPermissions("page.update")
    public updateCommentary (...args:HandlerArgs<Partial<IComicPageCommentary>>):Promise<IComicPageCommentary> {
        return pipeTo(Page.commentary.update, getParam("commentaryId"), getBody<Partial<IComicPageCommentary>>)(args);
    }

    @CheckPermissions("page.update")
    public removeCommentary (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(Page.commentary.remove, getParam("commentaryId"))(args);
    }

    @CheckPermissions("page.update")
    public sortCommentaries (...args:HandlerArgs<{commentaryId: string, newIndex: string}>):Promise<IComicPageCommentary[]> {
        return pipeTo(Page.commentary.sort, getParam("pageId"), getBodyParam("commentaryId"), getBodyParam("newIndex"))(args);
    }

    @CheckPermissions("page.update")
    public replaceImage (...args:HandlerArgs<Partial<IComicPage>>):Promise<IComicPage> {
        return pipeTo(Page.image.replace, getParam("pageId"), getFile)(args);
    }

    @CheckPermissions("page.update")
    public removeImage (...args:HandlerArgs<undefined>):Promise<any> {
        return pipeTo(Page.image.remove, getParam("pageId"))(args);
    }
}

export const PageHandlers = new PageHandlerClass();