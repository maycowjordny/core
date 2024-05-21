import { FastifyInstance } from "fastify";
import { CreateCategoryController } from "../controllers/category/create-category-controller";
import { FetchCategoryController } from "../controllers/category/fetch-category-controller";
import { UpdateCategoryController } from "../controllers/category/update-category-controller";

const createCategoryController = new CreateCategoryController();
const fetchCategoryController = new FetchCategoryController();
const updateCategoryController = new UpdateCategoryController();

export async function categoryRoutes(app: FastifyInstance) {
    app.post("/add", createCategoryController.create);
    app.get("/", fetchCategoryController.fetch);
    app.put("/:id", updateCategoryController.update);
}

