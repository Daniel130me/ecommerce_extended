
const Product = require('../models/Product');
const Category = require('../models/Category');

const createProduct = async (req, res) => {
  const { name, description, price, categories } = req.body;

  try {
    const images = req.files.map((file) => file.path);

    const product = new Product({
      name,
      description,
      price,
      categories,
      images,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const categoryFilter = req.query.categories
    ? { slug: { $in: req.query.categories.split(',') } }
    : {};

  try {
    const categoryIds = await Category.find(categoryFilter).select('_id');
    const categoriesToFilter = categoryIds.map(c => c._id);

    const count = await Product.countDocuments({ ...keyword, ...(categoriesToFilter.length > 0 && { categories: { $in: categoriesToFilter } }) });
    const products = await Product.find({ ...keyword, ...(categoriesToFilter.length > 0 && { categories: { $in: categoriesToFilter } }) })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate('categories');

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('categories');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { name, description, price, categories } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.categories = categories || product.categories;

      if (req.files && req.files.length > 0) {
        product.images = req.files.map((file) => file.path);
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};
