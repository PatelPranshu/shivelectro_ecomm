import { UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import api from "@/utils/api";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setImageFile(selectedFile);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setImageFile(droppedFile);
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (setUploadedImageUrl) {
      setUploadedImageUrl("");
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);
    const response = await api.post(
      "/admin/products/upload-image",
      data
    );

    if (response?.data?.success) {
      setUploadedImageUrl(response.data.result.secure_url);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  const hasImage = imageFile !== null || (uploadedImageUrl && uploadedImageUrl !== "");

  // Build preview URL: use uploaded cloudinary URL, or local blob preview for newly selected file
  const previewUrl = uploadedImageUrl || (imageFile ? URL.createObjectURL(imageFile) : null);

  return (
    <div
      className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-4"
      >
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
        />
        {!hasImage ? (
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center h-32 cursor-pointer"
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
            <span className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP accepted</span>
          </Label>
        ) : imageLoadingState ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <Skeleton className="h-20 w-20 rounded-md bg-gray-100" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Product preview"
                className="max-h-48 object-contain mb-3 rounded-md"
              />
            )}
            <div className="flex items-center justify-between w-full">
              <p className="text-sm font-medium line-clamp-1">
                {imageFile ? imageFile.name : "Current Image"}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground shrink-0"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">Remove File</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
