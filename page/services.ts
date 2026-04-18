import { IComicArc } from "src/comic-shared/arc/types";
import { IComicCharacter } from "../../comic-shared/character/types";
import { IComicPage, IComicPageCommentary } from "../../comic-shared/page/types";
import { Setting } from "../../common/setting/service";
import { basicCrudService, basicRelationService } from "../../core/express/service/common";
import { optionalMediaService } from "../../core/express/service/media";
import { reorder } from "../../core/express/util";
import { IPermission } from "../../uac-shared/permissions/types";
import { Query } from "../../core-shared/express/types";

const PageBasic = basicCrudService<IComicPage>(
    "comicPages",
    "name",
    {
        afterRemove: async (page: IComicPage) => {
            await Page.image.remove(page.id);
        }
    }
);
const CommentaryBasic = basicCrudService<IComicPageCommentary>("comicPageCommentaries");

export const Page = {
    ...PageBasic,
    search: async (q: Query = {}, userPermissionsPromise: Promise<IPermission[]>): Promise<IComicPage[]> => {
        const userPermissions = await userPermissionsPromise;
        const canViewDisabledPages = userPermissions.find(p => p.name === "comicPage.disabled");
        const allPages = await PageBasic.search(q);
        return allPages.filter(page =>
            canViewDisabledPages ||
            page.enabled && (
                !page.postDate ||
                new Date(page.postDate) <= new Date()
            )
        );
    },
    image: optionalMediaService<IComicPage>({
        dbTable: "comicPages",
        mediaColumn: "imageUrl",
        getFolder: () => Setting.get("comicMediaFolder"),
        getEntity: PageBasic.loadById,
        getFileName: (page: IComicPage) => page.imageUrl,
    }),
    sort: async (arcId: string, pageId: string, newIndex: string, userPermissionsPromise: Promise<IPermission[]>): Promise<IComicPage[]> => {
        await reorder("comicPages", pageId, newIndex, { arcId }, "sortOrder");
        return await Page.search({ arcId }, userPermissionsPromise);
    },
    enableAll: async (arcId: string) => Promise.all(
        (await PageBasic.search({ arcId })).map((page) => PageBasic.update(page.id, { enabled: true, postDate: new Date().toISOString() }))
    ),
    disableAll: async (arcId: string) => Promise.all(
        (await PageBasic.search({ arcId })).map((page) => PageBasic.update(page.id, { enabled: false }))
    ),
    character: basicRelationService<IComicCharacter, IComicPage>("comicPageCharacters", "pageId", "comicCharacters", "characterId"),
    commentary: {
        ...CommentaryBasic,
        sort: async (pageId: string, commentaryId: string, newIndex: string): Promise<IComicPageCommentary[]> => {
            await reorder("comicPageCommentaries", commentaryId, newIndex, { pageId }, "sortOrder");
            return await CommentaryBasic.search({ pageId });
        },
    },
}