import { IBehavior } from "../core/cloudfront";

export const comicCaching:IBehavior[] = [
    {precedence: 1, pathPattern: "/character*", cache: true },
    {precedence: 2, pathPattern: "/page*",   cache: true },
    {precedence: 3, pathPattern: "/arc*",cache: true },
];