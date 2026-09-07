import { cache } from "react";

/** One timestamp per server render so hours and hero badges agree at boundaries. */
export const getServerTime = cache(() => Date.now());
