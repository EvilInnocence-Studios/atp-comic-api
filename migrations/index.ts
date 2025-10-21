import { init } from "./00-init";
import { refreshData } from "./01-refresh";
import { addMedia } from "./02-characterMedia";

export const migrations = [init, refreshData, addMedia];