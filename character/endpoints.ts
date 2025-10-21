import { at } from "ts-functional";
import { del, get, patch, post, upload } from "../../core/express/wrappers";
import { CharacterHandler } from "./handlers";

export const CharacterEndpoints = {
    character: {
        GET: get(CharacterHandler.search),
        POST: upload(CharacterHandler.create),
        sort: {
            POST: post(CharacterHandler.sort),
        },
        ":characterId": {
            GET: get(CharacterHandler.get),
            PATCH: patch(CharacterHandler.update),
            DELETE: del(CharacterHandler.remove),
            media: {
                GET: get(CharacterHandler.getMedia),
                POST: upload(CharacterHandler.addMedia),
                ":mediaId": {
                    GET: get(CharacterHandler.getOneMedia),
                    PATCH: patch(CharacterHandler.updateMedia),
                    DELETE: del(CharacterHandler.removeMedia),
                },
                sort: {
                    POST: post(CharacterHandler.sortMedia),
                }
            },
            attribute: {
                GET: get(CharacterHandler.searchAttributes),
                POST: post(CharacterHandler.addAttribute),
                ":attributeId": {
                    PATCH: patch(CharacterHandler.updateAttribute),
                    DELETE: del(CharacterHandler.removeAttribute),
                },
                sort: {
                    POST: post(CharacterHandler.sortAttributes),
                }
            },
        }
    }
}