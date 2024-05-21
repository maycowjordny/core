export class LocationNotFoundException extends Error {
    constructor() {
        super("Location not found");
        this.name = "LocationNotFoundException";
    }
}
