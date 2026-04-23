import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { useSelector } from "react-redux";

function ProductFilter({ filters, handleFilter }) {
  const { categories, brands } = useSelector((state) => state.taxonomy);

  const dynamicFilterOptions = {
    category: categories.map((c) => ({ id: c.value, label: c.name })),
    brand: brands.map((b) => ({ id: b.value, label: b.name })),
  };

  return (
    <div className="bg-background rounded-xl border shadow-sm sticky top-24">
      <div className="p-5 border-b bg-muted/10 rounded-t-xl">
        <h2 className="text-xl font-extrabold tracking-tight">Filters</h2>
      </div>
      <div className="p-5 space-y-6 max-h-[calc(100vh-150px)] overflow-y-auto">
        {Object.keys(dynamicFilterOptions).map((keyItem, idx) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                {keyItem}
              </h3>
              <div className="grid gap-1">
                {dynamicFilterOptions[keyItem].map((option) => (
                  <Label 
                    key={option.id} 
                    className="flex font-medium items-center gap-3 cursor-pointer p-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    <span className="text-sm leading-none">{option.label}</span>
                  </Label>
                ))}
              </div>
            </div>
            {idx < Object.keys(dynamicFilterOptions).length - 1 && <Separator />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
