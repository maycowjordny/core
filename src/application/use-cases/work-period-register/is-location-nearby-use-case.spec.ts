import { IsLocationNearbyProps } from "@/domain/interfaces/work-period-register";
import { beforeEach, describe, expect, it } from "vitest";
import { IsLocationNearbyUseCase } from "./is-location-nearby-use-case";

describe("UpdateWorkPeriodRegisterUseCase", () => {
    let isLocationNearbyUseCase: IsLocationNearbyUseCase;

    beforeEach(() => {
        isLocationNearbyUseCase = new IsLocationNearbyUseCase();
    });

    it("should be able to check if the location is nearby", async () => {
        const response: IsLocationNearbyProps = {
            localizationCompany: { latitude: 34.0522, longitude: -118.2437 },
            registerLocation: { latitude: 34.0523, longitude: -118.2436 }
        };

        const output = await isLocationNearbyUseCase.execute(response);

        expect(output).toBeFalsy();
    });

});
