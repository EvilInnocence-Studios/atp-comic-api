import { Query, QueryArrayValue, QuerySingleValue, QueryValue } from "@core-shared/express/types";
import { IPermission } from "@uac-shared/permissions/types";
import { IComicArc } from "../../comic-shared/arc/types";
import { IComicCharacter } from "../../comic-shared/character/types";
import { Setting } from "../../common/setting/service";
import { basicCrudService, basicRelationService } from "../../core/express/service/common";
import { optionalMediaService } from "../../core/express/service/media";
import { reorder } from "../../core/express/util";
import { database } from "../../core/database";
import { objFilter } from "ts-functional";
import { Index } from "ts-functional/dist/types";

const db = database();

const ArcBasic = basicCrudService<IComicArc>(
    "comicArcs",
    "name",
    {
        afterRemove: async (arc: IComicArc) => {
            await Promise.all([
                Arc.thumbnail.remove(arc.id),
                Arc.banner.remove(arc.id),
            ]);
        }
    }
);

export const Arc = {
    ...ArcBasic,
    search: async ({ offset, perPage, ...query }: Query = {} as Query, userPermissionsPromise: Promise<IPermission[]> = Promise.resolve([])): Promise<IComicArc[]> => {
        const userPermissions = (await userPermissionsPromise) || [];
        const canViewDisabledArcs = userPermissions.find(p => p.name === "comicArc.disabled");

        const whereIn: Index<QueryArrayValue> = objFilter(
            (value: QueryValue) => Array.isArray(value)
        )(query) as Index<QueryArrayValue>;

        const where: Index<QuerySingleValue> = objFilter(
            (value: QueryValue) => !Array.isArray(value) && typeof value !== 'undefined'
        )(query) as Index<QuerySingleValue>;

        const stmt = db("comicArcs")
            .select("*")
            .where(where);

        Object.keys(whereIn).forEach(key => {
            stmt.whereIn(key, whereIn[key]);
        });

        if (!canViewDisabledArcs) {
            stmt.where("enabled", true)
                .whereNotNull("postDate")
                .where("postDate", "<=", db.fn.now());
        }

        return stmt.orderBy("sortOrder")
            .offset(offset || 0)
            .limit(perPage || 999999);
    },
    sort: async (parentId: string, arcId: string, newIndex: string, userPermissionsPromise: Promise<IPermission[]>): Promise<IComicArc[]> => {
        const pId = parentId === "null" ? null : parentId;
        await reorder("comicArcs", arcId, newIndex, { parentId: pId }, "sortOrder", "parentId");
        return await Arc.search({ parentId: pId }, userPermissionsPromise);
    },
    thumbnail: optionalMediaService<IComicArc>({
        dbTable: "comicArcs",
        mediaColumn: "thumbnailUrl",
        getFolder: () => Setting.get("comicMediaFolder"),
        getEntity: ArcBasic.loadById,
        getFileName: (arc: IComicArc) => arc.thumbnailUrl,
    }),
    banner: optionalMediaService<IComicArc>({
        dbTable: "comicArcs",
        mediaColumn: "bannerUrl",
        getFolder: () => Setting.get("comicMediaFolder"),
        getEntity: ArcBasic.loadById,
        getFileName: (arc: IComicArc) => arc.bannerUrl,
    }),
    character: basicRelationService<IComicCharacter, IComicArc>("comicArcCharacters", "arcId", "comicCharacters", "characterId"),
};
