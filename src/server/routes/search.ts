import express from "express";
import * as search from "../controllers/searchController";

export const searchRouter = express.Router();

searchRouter.get("/:query/:filter?", search.getSearchResults);
