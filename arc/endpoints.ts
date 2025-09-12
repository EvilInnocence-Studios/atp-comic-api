import { del, get, patch, post, upload } from "../../core/express/wrappers";
import { ArcHandlers } from "./handlers";

export const ArcEndpoints = {
    arc: {
        GET: get(ArcHandlers.search),
        POST: upload(ArcHandlers.create),
        ":arcId": {
            GET: get(ArcHandlers.get),
            PATCH: patch(ArcHandlers.update),
            DELETE: del(ArcHandlers.remove),
            thumbnail: {
                POST: upload(ArcHandlers.replaceThumbnail),
                DELETE: del(ArcHandlers.removeThumbnail),
            },
            banner: {
                POST: upload(ArcHandlers.replaceBanner),
                DELETE: del(ArcHandlers.removeBanner),
            },
            sort: {
                POST: post(ArcHandlers.sort),
            },
        }
    }
}