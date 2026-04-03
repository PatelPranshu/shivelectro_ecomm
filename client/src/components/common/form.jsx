import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  const [showPassword, setShowPassword] = useState(false);

  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    const renderInput = () => {
      const hasPrefix = Boolean(getControlItem.prefix);
      
      return (
        <div className="relative flex items-center">
          {hasPrefix && (
            <div className="absolute left-0 flex items-center pl-3 pointer-events-none text-muted-foreground mr-2 font-medium">
              {getControlItem.prefix}
            </div>
          )}
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            maxLength={getControlItem.maxLength}
            type={getControlItem.type === "password" && showPassword ? "text" : getControlItem.type}
            value={value}
            onChange={(event) => {
              let nextValue = event.target.value;
              if (getControlItem.pattern === "\\d*") {
                nextValue = nextValue.replace(/\D/g, ""); // Strip non-numeric
              }
              setFormData({
                ...formData,
                [getControlItem.name]: nextValue,
              });
            }}
            className={`${getControlItem.type === "password" ? "pr-10" : ""} ${hasPrefix ? "pl-11" : ""}`}
          />
          {getControlItem.type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
      );
    };

    switch (getControlItem.componentType) {
      case "input":
        element = renderInput();
        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );

        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;

      case "checkbox":
        element = (
          <Checkbox
            id={getControlItem.name}
            checked={!!value}
            onCheckedChange={(checked) =>
              setFormData({
                ...formData,
                [getControlItem.name]: checked,
              })
            }
          />
        );
        break;

      default:
        element = renderInput();
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => {
          if (controlItem.componentType === "checkbox") {
            return (
              <div 
                key={controlItem.name}
                className="flex items-center justify-between rounded-lg border p-4 mt-2 hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-0.5">
                  <Label htmlFor={controlItem.name} className="text-base font-semibold cursor-pointer">
                    {controlItem.label}
                  </Label>
                  {controlItem.description && (
                    <p className="text-sm text-muted-foreground">
                      {controlItem.description}
                    </p>
                  )}
                </div>
                {renderInputsByComponentType(controlItem)}
              </div>
            );
          }
          return (
            <div className="grid w-full gap-1.5" key={controlItem.name}>
              <Label className="mb-1">{controlItem.label}</Label>
              {renderInputsByComponentType(controlItem)}
            </div>
          );
        })}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
