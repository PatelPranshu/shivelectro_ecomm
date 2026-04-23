const Category = require("../../models/Category");
const Brand = require("../../models/Brand");

// Fetch both categories and brands (used publicly and internally)
const getTaxonomy = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: 1 });
    const brands = await Brand.find({}).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        categories,
        brands,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching taxonomy data",
    });
  }
};

// Add new Category (Admin only)
const addCategory = async (req, res) => {
  try {
    const { name, value } = req.body;
    
    // Check if category exists
    const existing = await Category.findOne({ value });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category with this value already exists",
      });
    }

    const newCategory = new Category({ name, value });
    await newCategory.save();

    res.status(201).json({
      success: true,
      data: newCategory,
      message: "Category added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error adding category",
    });
  }
};

// Delete Category (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error deleting category",
    });
  }
};

// Add new Brand (Admin only)
const addBrand = async (req, res) => {
  try {
    const { name, value } = req.body;
    
    // Check if brand exists
    const existing = await Brand.findOne({ value });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Brand with this value already exists",
      });
    }

    const newBrand = new Brand({ name, value });
    await newBrand.save();

    res.status(201).json({
      success: true,
      data: newBrand,
      message: "Brand added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error adding brand",
    });
  }
};

// Delete Brand (Admin only)
const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Brand.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error deleting brand",
    });
  }
};

module.exports = {
  getTaxonomy,
  addCategory,
  deleteCategory,
  addBrand,
  deleteBrand,
};
