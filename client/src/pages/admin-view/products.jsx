import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import RichTextEditor from "@/components/admin-view/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import TaxonomyManager from "@/components/admin-view/taxonomy-manager";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Package,
  ImagePlus,
  IndianRupee,
  Tag,
  Layers,
  AlignLeft,
} from "lucide-react";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  isFeature: false,
  freeDelivery: false,
  warranty: "",
  cashOnDelivery: false,
  returnPolicy: "",
  secureTransaction: false,
};

function AdminProducts() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const [openCategoryManager, setOpenCategoryManager] = useState(false);
  const [openBrandManager, setOpenBrandManager] = useState(false);

  const { productList } = useSelector((state) => state.adminProducts);
  const { categories, brands } = useSelector((state) => state.taxonomy);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const categoryOptions = categories.map((cat) => ({
    id: cat.value,
    label: cat.name,
  }));
  const brandOptions = brands.map((brand) => ({
    id: brand.value,
    label: brand.name,
  }));

  function openAddNew() {
    setCurrentEditedId(null);
    setFormData(initialFormData);
    setUploadedImageUrl("");
    setImageFile(null);
    setShowProductForm(true);
  }

  function closeForm() {
    setShowProductForm(false);
    setCurrentEditedId(null);
    setFormData(initialFormData);
    setUploadedImageUrl("");
    setImageFile(null);
  }

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData: {
              ...formData,
              image: uploadedImageUrl,
            },
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            closeForm();
            toast({ title: "Product updated successfully" });
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            closeForm();
            toast({ title: "Product added successfully" });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter(
        (currentKey) =>
          currentKey !== "averageReview" &&
          currentKey !== "isFeature" &&
          currentKey !== "salePrice"
      )
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Full-page Add/Edit form
  if (showProductForm) {
    return (
      <Fragment>
        <form onSubmit={onSubmit} className="w-full">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={closeForm}
                className="rounded-full shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {currentEditedId !== null
                    ? "Edit Product"
                    : "Add New Product"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {currentEditedId !== null
                    ? "Update the product details below"
                    : "Fill in details to add a new product"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Name, Category & Brand & Image — full width */}
          <div className="rounded-xl border bg-card p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Name, Category & Brand</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: title + category/brand */}
              <div className="space-y-5">
                <div className="grid w-full gap-2">
                  <Label htmlFor="title">Product Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter product title"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 gap-5">
                  <div className="grid w-full gap-2">
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid w-full gap-2">
                    <Label>Brand</Label>
                    <Select
                      value={formData.brand}
                      onValueChange={(value) =>
                        setFormData({ ...formData, brand: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brandOptions.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Right: image upload */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ImagePlus className="h-4 w-4 text-primary" />
                  <Label className="text-base font-medium">Product Image</Label>
                </div>
                <ProductImageUpload
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  uploadedImageUrl={uploadedImageUrl}
                  setUploadedImageUrl={setUploadedImageUrl}
                  setImageLoadingState={setImageLoadingState}
                  imageLoadingState={imageLoadingState}
                  isEditMode={currentEditedId !== null}
                  isCustomStyling={true}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Product Description */}
          <div className="rounded-xl border bg-card p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-5">
              <AlignLeft className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Product Description</h2>
            </div>
            <div className="grid w-full gap-2">
              <RichTextEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    description: value,
                  })
                }
                placeholder="Enter product description"
              />
            </div>
          </div>

          {/* Section 3: Pricing & Stock */}
          <div className="rounded-xl border bg-card p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-5">
              <IndianRupee className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Pricing & Stock</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="grid w-full gap-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter product price"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="salePrice">Sale Price (₹)</Label>
                <Input
                  id="salePrice"
                  type="number"
                  placeholder="Optional"
                  value={formData.salePrice || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, salePrice: e.target.value })
                  }
                />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="totalStock">Total Stock</Label>
                <Input
                  id="totalStock"
                  type="number"
                  placeholder="Enter total stock"
                  value={formData.totalStock || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, totalStock: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Section 4: Settings & Features */}
          <div className="rounded-xl border bg-card p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Settings & Features</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="isFeature" className="text-base font-semibold cursor-pointer">
                    Feature Product
                  </Label>
                  <p className="text-sm text-muted-foreground">Highlight this product on the home page.</p>
                </div>
                <Checkbox
                  id="isFeature"
                  checked={!!formData.isFeature}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeature: checked })}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="freeDelivery" className="text-base font-semibold cursor-pointer">
                    Free Delivery
                  </Label>
                  <p className="text-sm text-muted-foreground">Show free delivery badge.</p>
                </div>
                <Checkbox
                  id="freeDelivery"
                  checked={!!formData.freeDelivery}
                  onCheckedChange={(checked) => setFormData({ ...formData, freeDelivery: checked })}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="cashOnDelivery" className="text-base font-semibold cursor-pointer">
                    Cash on Delivery
                  </Label>
                  <p className="text-sm text-muted-foreground">Show cash on delivery badge.</p>
                </div>
                <Checkbox
                  id="cashOnDelivery"
                  checked={!!formData.cashOnDelivery}
                  onCheckedChange={(checked) => setFormData({ ...formData, cashOnDelivery: checked })}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="secureTransaction" className="text-base font-semibold cursor-pointer">
                    Secure Transaction
                  </Label>
                  <p className="text-sm text-muted-foreground">Show secure transaction badge.</p>
                </div>
                <Checkbox
                  id="secureTransaction"
                  checked={!!formData.secureTransaction}
                  onCheckedChange={(checked) => setFormData({ ...formData, secureTransaction: checked })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="grid w-full gap-2">
                  <Label htmlFor="warranty">Warranty (Optional)</Label>
                  <Input
                    id="warranty"
                    type="text"
                    placeholder="e.g. 1 Year Warranty"
                    value={formData.warranty || ""}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                  />
                </div>
                <div className="grid w-full gap-2">
                  <Label htmlFor="returnPolicy">Return Policy (Optional)</Label>
                  <Input
                    id="returnPolicy"
                    type="text"
                    placeholder="e.g. 7 Days Return"
                    value={formData.returnPolicy || ""}
                    onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end gap-3 mb-4">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || imageLoadingState}
              className="min-w-[140px]"
            >
              {currentEditedId !== null ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>

        <TaxonomyManager
          isOpen={openCategoryManager}
          setIsOpen={setOpenCategoryManager}
          type="category"
        />
        <TaxonomyManager
          isOpen={openBrandManager}
          setIsOpen={setOpenBrandManager}
          type="brand"
        />
      </Fragment>
    );
  }

  // Product listing view
  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setOpenCategoryManager(true)}
          >
            Manage Categories
          </Button>
          <Button variant="outline" onClick={() => setOpenBrandManager(true)}>
            Manage Brands
          </Button>
        </div>
        <Button onClick={openAddNew}>Add New Product</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={(open) => {
                  if (open) setShowProductForm(true);
                }}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
                setUploadedImageUrl={setUploadedImageUrl}
              />
            ))
          : null}
      </div>

      <TaxonomyManager
        isOpen={openCategoryManager}
        setIsOpen={setOpenCategoryManager}
        type="category"
      />
      <TaxonomyManager
        isOpen={openBrandManager}
        setIsOpen={setOpenBrandManager}
        type="brand"
      />
    </Fragment>
  );
}

export default AdminProducts;
