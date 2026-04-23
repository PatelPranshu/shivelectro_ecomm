const Product = require("../../models/Product");
const SiteConfig = require("../../models/SiteConfig");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;

        break;
      case "price-hightolow":
        sort.price = -1;

        break;
      case "title-atoz":
        sort.title = 1;

        break;

      case "title-ztoa":
        sort.title = -1;

        break;

      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);

    // Backend enforcement: strip prices if showPrice is disabled
    const config = await SiteConfig.findOne();
    let responseData = products;

    if (config && config.showPrice === false) {
      responseData = products.map((product) => {
        const productObj = product.toObject();
        delete productObj.price;
        delete productObj.salePrice;
        return productObj;
      });
    }

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    // Backend enforcement: strip prices if showPrice is disabled
    const config = await SiteConfig.findOne();
    let responseData = product;

    if (config && config.showPrice === false) {
      responseData = product.toObject();
      delete responseData.price;
      delete responseData.salePrice;
    }

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
