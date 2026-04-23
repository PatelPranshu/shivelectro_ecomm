import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { addCategory, deleteCategory, addBrand, deleteBrand } from "@/store/common-slice/taxonomy-slice";
import { useToast } from "@/components/ui/use-toast";

export default function TaxonomyManager({ isOpen, setIsOpen, type }) {
  const [name, setName] = useState("");
  const { categories, brands, isLoading } = useSelector((state) => state.taxonomy);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const isCategory = type === "category";
  const items = isCategory ? categories : brands;
  const title = isCategory ? "Manage Categories" : "Manage Brands";

  const handleAdd = () => {
    if (!name.trim()) return;

    // Convert name to value: "Mobile Operated Switch" -> "mobileoperatedswitch"
    const value = name.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (items.find((item) => item.value === value)) {
      toast({
        title: "Error",
        description: `This ${type} already exists.`,
        variant: "destructive",
      });
      return;
    }

    const payload = { name: name.trim(), value };
    const action = isCategory ? addCategory(payload) : addBrand(payload);

    dispatch(action).then((data) => {
      if (data?.payload?.success) {
        toast({ title: `${isCategory ? "Category" : "Brand"} added successfully` });
        setName("");
      } else {
        toast({
          title: "Error",
          description: data?.payload?.message || `Failed to add ${type}.`,
          variant: "destructive",
        });
      }
    });
  };

  const handleDelete = (id) => {
    const action = isCategory ? deleteCategory(id) : deleteBrand(id);
    dispatch(action).then((data) => {
      if (data?.payload?.success) {
        toast({ title: `${isCategory ? "Category" : "Brand"} deleted successfully` });
      } else {
        toast({
          title: "Error",
          description: `Failed to delete ${type}.`,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Add or remove options. Deleting an option will remove it from the store filters.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 my-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="name" className="sr-only">
              Name
            </Label>
            <Input
              id="name"
              placeholder={`New ${type} name (e.g., Transformers)`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <Button type="button" onClick={handleAdd} disabled={isLoading || !name.trim()}>
            Add
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-2 pr-2">
            {items && items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                >
                  <span className="font-medium text-sm">{item.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(item._id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-muted-foreground text-sm border rounded-lg border-dashed">
                No {type}s found.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
