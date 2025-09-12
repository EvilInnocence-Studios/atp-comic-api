import { at } from "ts-functional";
import { del, get, patch, post, upload } from "../../core/express/wrappers";
import { CharacterHandler } from "./handlers";

export const CharacterEndpoints = {
    character: {
        GET: get(CharacterHandler.search),
        POST: upload(CharacterHandler.create),
        ":characterId": {
            GET: get(CharacterHandler.get),
            PATCH: patch(CharacterHandler.update),
            DELETE: del(CharacterHandler.remove),
            image: {
                POST: upload(CharacterHandler.replaceImage),
                DELETE: del(CharacterHandler.removeImage),
            },
            sort: {
                POST: post(CharacterHandler.sort),
            },
            attribute: {
                GET: get(CharacterHandler.searchAttributes),
                POST: post(CharacterHandler.addAttribute),
                ":attributeId": {
                    PATCH: patch(CharacterHandler.updateAttribute),
                    DELETE: del(CharacterHandler.removeAttribute),
                }
            },
        }
    }
}