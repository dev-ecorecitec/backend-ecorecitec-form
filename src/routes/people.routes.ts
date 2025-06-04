import { Router } from "express";
import { PeopleController } from "../controllers/people/people.controller";

const peopleRoutes = Router();
const peopleController = new PeopleController();

// Criar uma nova pessoa
peopleRoutes.post("/people/create", peopleController.create);

// Listar todas as pessoas
peopleRoutes.get("/people", peopleController.list);

// Buscar uma pessoa específica
peopleRoutes.get("/people/:id", peopleController.getById);

// Atualizar uma pessoa
peopleRoutes.put("/people/:id", peopleController.update);

// Excluir uma pessoa
peopleRoutes.delete("/people/:id", peopleController.delete);

export { peopleRoutes }; 