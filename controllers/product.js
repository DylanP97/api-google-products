const Product = require("../models/product");
const fs = require("fs");

exports.getProducts = (req, res) => {
  const limit = parseInt(req.query.pageSize) || 10;
  const pageNbr = parseInt(req.query.page) || 0;
  const skip = pageNbr * limit;
  const countPromise = Product.countDocuments(); // count total number of products
  const findPromise = Product.find().skip(skip).limit(limit);

  Promise.all([countPromise, findPromise])
    .then(([totalProducts, products]) => {
      res.status(200).json({ totalProducts, products });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getAllProducts = (req, res) => {
  Product.find()
    .then((products) => res.status(200).json({ products }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneProduct = (req, res) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => res.status(200).json(product))
    .catch((error) => res.status(404).json({ error }));
};

exports.createProduct = (req, res) => {
  const productObject = JSON.parse(req.body.product);
  delete productObject._id;
  delete productObject.userId;

  if (productObject) {
    const product = new Product({
      ...productObject,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
      userId: req.auth.userId,
    });
    product
      .save()
      .then(() => {
        res.status(201).json({ message: "product ajouté !" });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } else {
    res.status(404).json({ message: "L'un des champs n'est pas valide" });
  }
};

exports.modifyProduct = (req, res) => {
  const productObject = req.file
    ? {
        ...JSON.parse(req.body.product),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

    Product
      .findOne({ _id: req.params.id })

      .then((product) => {
        if (product.userId != req.auth.userId) {
          res.status(401).json({ message: "Unauthorized" });
        } else {
          Product
            .updateOne(
              { _id: req.params.id },
              { ...productObject, _id: req.params.id }
            )

            .then(() => {
              res.status(200).json({ message: "product modifié!" });
            })
            .catch((error) => {
              res.status(400).json({ error });
            });
        }
      })
      .catch((error) => {
        res.status(404).json({ error });
      });
};

exports.deleteProduct = (req, res) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => {
      if (product.userId !== req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        const filename = product.imageUrl.split("/images/")[1];
        fs.unlink(`../images/${filename}`, () => {
          product
            .deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch(() =>
              res.status(401).json({ message: "Non-authorisé 2" })
            );
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.likeProduct = (req, res) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => {
      let indexId = product.usersLiked.indexOf(req.auth.userId);
      let index2Id = product.usersDisliked.indexOf(req.auth.userId);

      if (product.usersLiked.includes(req.auth.userId)) {
        if (req.body.like == 1) {
          res.status(409).json({
            message:
              "Vous aviez déjà liké dans le passé et vous essayé de liker une nouvelle fois",
          });
        } else if (req.body.like == 0) {
          product.likes--;
          product.usersLiked.splice(indexId, 1);
          res
            .status(201)
            .json({ message: "Vous avez bien retirer votre like" });
        } else if (req.body.like == -1) {
          product.dislikes++;
          product.likes--;
          product.usersLiked.splice(indexId, 1);
          product.usersDisliked.push(req.auth.userId);
          res.status(201).json({
            message:
              "Vous avez bien disliké alors que étiez de ceux qui ont liké",
          });
        }
      } else if (index2Id == -1 && indexId == -1) {
        if (req.body.like == 1) {
          product.likes++;
          product.usersLiked.push(req.auth.userId);
          res.status(201).json({
            message: "Vous avez bien liké alors que vous étiez neutre",
          });
        } else if (req.body.like == 0) {
          res
            .status(409)
            .json({ message: "Vous aviez déjà fait aucun like/dislike" });
        } else if (req.body.like == -1) {
          product.dislikes++;
          product.usersDisliked.push(req.auth.userId);
          res.status(201).json({
            message: "Vous avez bien disliké alors que vous étiez neutre",
          });
        }
      } else if (product.usersDisliked.includes(req.auth.userId)) {
        if (req.body.like == 1) {
          product.likes++;
          product.dislikes--;
          product.usersLiked.push(req.auth.userId);
          product.usersDisliked.splice(index2Id, 1);
          res.status(201).json({
            message: "Vous avez bien liké alors que vous aviez disliké",
          });
        } else if (req.body.like == 0) {
          product.dislikes--;
          product.usersDisliked.splice(index2Id, 1);
          res
            .status(201)
            .json({ message: "Vous avez bien retirer votre dislike" });
        } else if (req.body.like == -1) {
          res
            .status(409)
            .json({ message: "Vous aviez déjà disliké dans le passé" });
        }
      }
      product.save();
    })
    .catch((error) => res.status(404).json({ error }));
};
