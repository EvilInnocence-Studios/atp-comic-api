import { Setting } from "../../common/setting/service";
import { basicCrudService } from "../../core/express/service/common";
import { optionalMediaService } from "../../core/express/service/media";
import { reorder } from "../../core/express/util";
import { IComicArc } from "../../comic-shared/arc/types";

const ArcBasic = basicCrudService<IComicArc>("comicArcs");

export const Arc = {
    ...ArcBasic,
    sort: async (parentId:string, arcId: string, newIndex: string):Promise<IComicArc[]> => {
        await reorder("comicArcs", arcId, newIndex, {parentId});
        return await Arc.search({parentId});
    },
    thumbnail: optionalMediaService<IComicArc>({
        dbTable: "comicArcs",
        mediaColumn: "thumbnailUrl",
        getFolder: () => Setting.get("comicMediaFolder"),
        getEntity: ArcBasic.loadById,
        getFileName: (arc:IComicArc) => arc.thumbnailUrl,
    }),
    banner: optionalMediaService<IComicArc>({
        dbTable: "comicArcs",
        mediaColumn: "bannerUrl",
        getFolder: () => Setting.get("comicMediaFolder"),
        getEntity: ArcBasic.loadById,
        getFileName: (arc:IComicArc) => arc.bannerUrl,
    }),
};
