import { del, get, patch, post, upload } from "../../core/express/wrappers";
import { PageHandlers } from "./handlers";

export const PageEndpoints = {
    page: {
        GET: get(PageHandlers.search),
        POST: upload(PageHandlers.create),
        ":pageId": {
            GET: get(PageHandlers.get),
            PATCH: patch(PageHandlers.update),
            DELETE: del(PageHandlers.remove),
            image: {
                POST: upload(PageHandlers.replaceImage),
                DELETE: del(PageHandlers.removeImage),
            },
            sort: {
                POST: post(PageHandlers.sort),
            },
            character: {
                GET: get(PageHandlers.getCharacters),
                POST: post(PageHandlers.addCharacter),
                ":characterId": {
                    DELETE: del(PageHandlers.removeCharacter),
                },
            },
            commentary: {
                GET: get(PageHandlers.getCommentaries),
                POST: post(PageHandlers.addCommentary),
                sort: {
                    POST: post(PageHandlers.sortCommentaries),
                },
                ":commentaryId": {
                    PATCH: patch(PageHandlers.updateCommentary),
                    DELETE: del(PageHandlers.removeCommentary),
                }
            },
        }
    }
}