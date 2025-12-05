import { TestBed } from "@angular/core/testing";

import { sPokemon } from "./spokemon";

describe("Pokemon", () => {
  let service: sPokemon;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(sPokemon);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
