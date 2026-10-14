import { IComicArc } from "src/comic-shared/arc/types";
import { IComicCharacter } from "../../comic-shared/character/types";
import { IComicPage, IComicPageCommentary } from "../../comic-shared/page/types";
import { Setting } from "../../common/setting/service";
import { basicCrudService, basicRelationService } from "../../core/express/service/common";
import { optionalMediaService } from "../../core/express/service/media";
import { reorder } from "../../core/express/util";
import { IPermission } from "../../uac-shared/permissions/types";
import { Query, QueryArrayValue, QuerySingleValue, QueryValue } from "../../core-shared/express/types";
import { database } from "../../core/database";
import { objFilter } from "ts-functional";
import { Index } from "ts-functional/dist/types";
import { getSiteTimezone, getSiteTodayDate } from "../../core/config";

const db = database();

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
    search: async ({ offset, perPage, ...query }: Query = {} as Query, userPermissionsPromise: Promise<IPermission[]> = Promise.resolve([])): Promise<IComicPage[]> => {
        const userPermissions = (await userPermissionsPromise) || [];
        const canViewDisabledPages = userPermissions.find(p => p.name === "comicPage.disabled");

        const whereIn: Index<QueryArrayValue> = objFilter(
            (value: QueryValue) => Array.isArray(value)
        )(query) as Index<QueryArrayValue>;

        const where: Index<QuerySingleValue> = objFilter(
            (value: QueryValue) => !Array.isArray(value) && typeof value !== 'undefined'
        )(query) as Index<QuerySingleValue>;

        const stmt = db("comicPages")
            .select("*")
            .where(where);

        Object.keys(whereIn).forEach(key => {
            stmt.whereIn(key, whereIn[key]);
        });

        if (!canViewDisabledPages) {
            const timezone = (await Setting.get("site.timezone")) || getSiteTimezone();
            const today = getSiteTodayDate(timezone);
            stmt.where("enabled", true)
                .whereNotNull("postDate")
                .where("postDate", "<=", today);
        }

        return stmt.orderBy("sortOrder")
            .offset(offset || 0)
            .limit(perPage || 999999);
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
    enableAll: async (arcId: string) => {
        const timezone = (await Setting.get("site.timezone")) || getSiteTimezone();
        const today = getSiteTodayDate(timezone);
        return Promise.all(
            (await PageBasic.search({ arcId })).map((page) => PageBasic.update(page.id, { enabled: true, postDate: today }))
        );
    },
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