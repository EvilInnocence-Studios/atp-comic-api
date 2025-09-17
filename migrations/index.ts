import { init } from "./00-init";
import { refreshData } from "./01-refresh";

export const migrations = [init, refreshData];