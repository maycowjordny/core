import { IsLocationNearbyProps } from "@/domain/interfaces/work-period-register";
import haversine from "haversine";

export class IsLocationNearbyUseCase {

    private limitAllowedToRegisterPoint: number = 40;

    async execute({ localizationCompany, registerLocation }: IsLocationNearbyProps): Promise<boolean> {
        const totalDistance = haversine(registerLocation, localizationCompany);

        return totalDistance > this.limitAllowedToRegisterPoint;
    }
}
