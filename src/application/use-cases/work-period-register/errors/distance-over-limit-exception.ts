export class DistanceOverLimitException extends Error {
    constructor() {
        super("The distance between the registered location and the business location is below the allowed limit.");
        this.name = "DistanceOverLimitException";
    }
}
