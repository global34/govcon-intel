import { createReader } from "@keystatic/core/reader";

import config from "../../keystatic.config";

export const keystaticReader = createReader(process.cwd(), config);

