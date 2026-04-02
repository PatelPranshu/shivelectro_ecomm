import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all relative ${
        isSelected
          ? "border-primary bg-primary/5 border-[2px] shadow-sm"
          : "border-border hover:border-primary/50"
      }`}
    >
      <CardContent className="grid p-4 gap-2">
        {setCurrentSelectedAddress && (
          <div className="absolute top-4 right-4">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-primary' : 'border-muted-foreground/50'}`}>
              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
          </div>
        )}
        <div className="pr-8 space-y-2">
          <Label className="font-bold text-base block">{addressInfo?.address}</Label>
          <Label className="block font-normal text-muted-foreground">City: {addressInfo?.city}</Label>
          <Label className="block font-normal text-muted-foreground">Pincode: {addressInfo?.pincode}</Label>
          <Label className="block font-normal text-muted-foreground">Phone: {addressInfo?.phone}</Label>
          {addressInfo?.notes && (
            <Label className="block font-normal text-muted-foreground">Notes: {addressInfo?.notes}</Label>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 flex justify-between border-t border-muted/50 bg-muted/10">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => { 
            e.stopPropagation(); 
            handleEditAddress(addressInfo); 
          }}
        >
          Edit
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={(e) => { 
            e.stopPropagation(); 
            handleDeleteAddress(addressInfo); 
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
