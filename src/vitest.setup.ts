import "reflect-metadata";

import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

global.fetchMock = createFetchMock(vi);
