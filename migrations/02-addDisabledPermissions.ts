import { database } from "../../core/database";
import { IMigration } from "../../core/dbMigrations";
import { insertPermissions, insertRolePermissions } from "../../uac/migrations/util";

const db = database();

const permissions = [
    { name: "comicPage.disabled", description: "Can view disabled pages and scheduled future pages" },
    { name: "comicArc.disabled", description: "Can view disabled arcs and scheduled future arcs" },
];

const rolePermissions = [
    { roleName: "SuperUser", permissionName: "comicPage.disabled" },
    { roleName: "SuperUser", permissionName: "comicArc.disabled" },
];

export const addDisabledPermissions: IMigration = {
    name: "addDisabledPermissions",
    module: "comic",
    description: "Add comicPage.disabled and comicArc.disabled permissions to comic module",
    order: 2,
    version: "1.1.0",
    up: async () => {
        try {
            await insertPermissions(db, permissions);
            await insertRolePermissions(db, rolePermissions);
            // Clean up temporary page.disabled and arc.disabled if previously inserted
            const obsoletePerms = await db("permissions").whereIn("name", ["page.disabled", "arc.disabled"]).select("id");
            if (obsoletePerms.length > 0) {
                const ids = obsoletePerms.map(p => p.id);
                await db("rolePermissions").whereIn("permissionId", ids).delete();
                await db("permissions").whereIn("id", ids).delete();
            }
        } catch (e: any) {
            console.warn("Could not insert disabled permissions:", e.message);
        }
    },
    down: async () => {},
    initData: async () => {}
};

export const migration = addDisabledPermissions;
