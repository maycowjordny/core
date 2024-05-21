import { app } from "@/app";
import { absenceRoutes } from "./absence.routes";
import { addressRoutes } from "./address.routes";
import { categoryRoutes } from "./category.routes";
import { companyRoutes } from "./company.routes";
import { employeeRoutes } from "./employee.routes";
import { sessionRoutes } from "./session.routes";
import { subUserRoutes } from "./sub-user.routes";
import { userRoutes } from "./user.routes";
import { workPeriodRegisterRoutes } from "./work-period-register.routes";
import { workPeriodRoutes } from "./work-period.routes";

export async function appRoutes() {
    app.register(sessionRoutes, { prefix: "/session" });
    app.register(absenceRoutes, { prefix: "/absence" });
    app.register(companyRoutes, { prefix: "/company" });
    app.register(employeeRoutes, { prefix: "/employee" });
    app.register(subUserRoutes, { prefix: "/sub-user" });
    app.register(addressRoutes, { prefix: "/address" });
    app.register(categoryRoutes, { prefix: "/category" });
    app.register(userRoutes, { prefix: "/user" });
    app.register(workPeriodRoutes, { prefix: "/work-period" });
    app.register(workPeriodRegisterRoutes, { prefix: "/work-period-register" });
}
