import "zone.js/testing";
import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

import "./app/pages/users/password-validator.spec";
import "./app/components/statistics/statistics.component.spec";
import "./app/guards/auth.guard.spec";
import "./app/guards/role.guard.spec";
import "./app/guards/login.guard.spec";
import "./app/services/auth.service.spec";
