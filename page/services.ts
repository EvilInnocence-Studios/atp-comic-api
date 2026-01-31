import { IComicCharacter } from "../../comic-shared/character/types";
import { IComicPage, IComicPageCommentary } from "../../comic-shared/page/types";
import { Setting } from "../../common/setting/service";
import { basicCrudService, basicRelationService } from "../../core/express/service/common";
import { optionalMediaService } from "../../core/express/service/media";
import { reorder } from "../../core/express/util";

const PageBasic = basicCrudService<IComicPage>("comicPages");
const CommentaryBasic = basicCrudService<IComicPageCommentary>("comicPageCommentaries");

export const Page = {
    ...PageBasic,
    image: optionalMediaService<IComicPage>({
        dbTable: "comicPages",
        mediaColumn: "imageUrl",
        getFolder: () => Setting.get("comicMediaFolder"),
        getEntity: PageBasic.loadById,
        getFileName: (page:IComicPage) => page.imageUrl,
    }),
    sort: async (arcId:string, pageId: string, newIndex: string):Promise<IComicPage[]> => {
        await reorder("comicPages", pageId, newIndex, {arcId});
        return await PageBasic.search({arcId});
    },
    // enableAll: async (arcId: string) => Promise.all(
    //     (await PageBasic.search({arcId})).map((page) => PageBasic.update(page.id, {enabled: true, postDate: new Date().toISOString()}))
    // ),
    // disableAll: async (arcId: string) => Promise.all(
    //     (await PageBasic.search({arcId})).map((page) => PageBasic.update(page.id, {enabled: false}))
    // ),
    character: basicRelationService<IComicCharacter, IComicPage>("comicPageCharacters", "pageId", "comicCharacters", "characterId"),
    commentary: {
        ...CommentaryBasic,
        sort: async (pageId:string, commentaryId: string, newIndex: string):Promise<IComicPageCommentary[]> => {
            await reorder("comicCommentaries", commentaryId, newIndex, {pageId});
            return await CommentaryBasic.search({pageId});
        },
    },
}