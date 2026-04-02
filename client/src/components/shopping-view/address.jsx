import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  function handleManageAddress(event) {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: validationError,
        variant: "destructive",
      });
      return;
    }

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });

      return;
    }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            setShowAddAddress(false);
            toast({
              title: "Address updated successfully",
            });
          } else {
            toast({ title: data?.payload?.message || "Data validation error from server", variant: "destructive" });
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setFormData(initialAddressFormData);
            setShowAddAddress(false);
            toast({
              title: "Address added successfully",
            });
          } else {
            toast({ title: data?.payload?.message || "Data validation error from server", variant: "destructive" });
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({
          title: "Address deleted successfully",
        });
      }
    });
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      ...formData,
      address: getCuurentAddress?.address,
      city: getCuurentAddress?.city,
      phone: getCuurentAddress?.phone,
      pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes,
    });
  }

  function validateForm() {
    if (!formData.address?.trim() || !formData.city?.trim()) {
      return "Address and City are required fields.";
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      return "PIN code must be exactly 6 digits.";
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      return "Phone number must be exactly 10 digits.";
    }
    return null;
  }

  const [showAddAddress, setShowAddAddress] = useState(false);

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  return (
    <Card className="border-none shadow-none">
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id}
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      
      {!showAddAddress && currentEditedId === null ? (
        <Button 
          onClick={() => setShowAddAddress(true)} 
          className="w-full sm:w-auto"
          variant="outline"
        >
          + Add New Address
        </Button>
      ) : (
        <Card className="mt-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {currentEditedId !== null ? "Edit Address" : "Add New Address"}
            </CardTitle>
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowAddAddress(false);
                setCurrentEditedId(null);
                setFormData(initialAddressFormData);
              }}
            >
              Cancel
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <CommonForm
              formControls={addressFormControls}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Save"}
              onSubmit={(e) => {
                handleManageAddress(e);
                // setShowAddAddress(false); moved away from direct blind toggle to allow validation pausing.
              }}
              // isBtnDisabled={false}
            />
          </CardContent>
        </Card>
      )}
    </Card>
  );
}

export default Address;
