import express from "express";
import Tag from "../schemas/tagSchema.js";
import { ControllerErrorHandler } from "../errors.js";

const tagsRouter = express.Router();

tagsRouter.get("/", (req, res) => {
    Tag.find()
        .lean(true).exec()
        .then(tags => {
            if (!tags || tags == [])  throw new NotFoundError("Tags not found");

            res.json(tags).status(200);
        })
        .catch((err) => ControllerErrorHandler(err, res));
});


tagsRouter.get('/:id', (req, res) => {
    Tag.find({id: req.params.id}).lean(true).exec()
        .then(tags => {
            if (!tags || tags == [])  throw new NotFoundError("Tag not found");

            res.json(tags).status(200);
        })
        .catch((err) => ControllerErrorHandler(err, res));
});

tagsRouter.post('/', (req, res) => {
    let tagDb = new Tag(req.body);

    tagDb.save()
        .then(tag => {
            res.json(tag).status(200);
        })
        .catch((err) => handleControllerError(err, res));
});


tagsRouter.delete("/:id", (req, res) => {
    let deleteTag = (tag) => {
        if (!tag) throw new NotFoundError("Tag not found");

        return tag.remove();
    };

    Tag.find({id: req.params.id}).exec()
        .then((tag) => deleteTag(tag))
        .then(() => {
            res.status('200').json("Tag deleted").end();
        })
        .catch((err) => handleControllerError(err, res));
});

export default tagsRouter;