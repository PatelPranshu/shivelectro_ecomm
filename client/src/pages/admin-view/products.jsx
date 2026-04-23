import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
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

  // Dynamically inject category and brand options into the form configuration
  const dynamicFormElements = addProductFormElements.map((el) => {
    if (el.name === "category") {
      return {
        ...el,
        options: categories.map((cat) => ({ id: cat.value, label: cat.name })),
      };
    }
    if (el.name === "brand") {
      return {
        ...el,
        options: brands.map((brand) => ({ id: brand.value, label: brand.name })),
      };
    }
    return el;
  });

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
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
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
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Product add successfully",
            });
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
      .filter((currentKey) => currentKey !== "averageReview" && currentKey !== "isFeature")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);


  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setOpenCategoryManager(true)}>
            Manage Categories
          </Button>
          <Button variant="outline" onClick={() => setOpenBrandManager(true)}>
            Manage Brands
          </Button>
        </div>
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
                setUploadedImageUrl={setUploadedImageUrl}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
            <SheetDescription>
              {currentEditedId !== null
                ? "Make changes to your product here. Click save when you're done."
                : "Fill in the details below to add a new product to your store."}
            </SheetDescription>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={dynamicFormElements}
              isBtnDisabled={!isFormValid()}
              buttonHidden={imageLoadingState}
            />
          </div>
        </SheetContent>
      </Sheet>

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
