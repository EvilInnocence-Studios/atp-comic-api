import { Query } from "@core-shared/express/types";
import { IPermission } from "@uac-shared/permissions/types";
import { IComicArc } from "../../comic-shared/arc/types";
import { IComicCharacter } from "../../comic-shared/character/types";
import { Setting } from "../../common/setting/service";
import { basicCrudService, basicRelationService } from "../../core/express/service/common";
import { optionalMediaService } from "../../core/express/service/media";
import { reorder } from "../../core/express/util";

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
    search: async (q: Query = {}, userPermissionsPromise: Promise<IPermission[]>): Promise<IComicArc[]> => {
        const userPermissions = await userPermissionsPromise;
        const canViewDisabledArcs = userPermissions.find(p => p.name === "comicArc.disabled");
        const allArcs = await ArcBasic.search(q);
        return allArcs.filter(arc =>
            canViewDisabledArcs ||
            arc.enabled && (
                !arc.postDate ||
                new Date(arc.postDate) <= new Date()
            )
        );
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
