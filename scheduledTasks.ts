import { ScheduledTaskRegistry } from "../common/scheduledTask";
import { CacheService } from "../common/cache/service";

ScheduledTaskRegistry.register({
    id: "comic:clear-page-and-arc-cache",
    name: "Clear Comic Page and Arc Cache",
    module: "comic",
    description: "Clears CloudFront cache for comic pages and arcs at midnight every day.",
    defaultSchedule: {
        type: "cron",
        cronExpression: "0 0 * * *",
        timezone: "UTC"
    },
    defaultEnabled: true,
    run: async () => {
        const result = await CacheService.clear(["page", "arc"]);
        return {
            message: result?.message || "Comic page and arc cache cleared successfully.",
            data: result
        };
    }
});
