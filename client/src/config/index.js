export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "elcb", label: "ELCB" },
      { id: "elcbmcb", label: "ELCB+LCB" },
      { id: "ol", label: "Overload" },
      { id: "timer", label: "Timer" },
      { id: "mbs", label: "Mobile Operated Switch" },
      { id: "SFG", label: "Solar Fence Guard" },
      { id: "dol", label: "Direct On Line" },
      { id: "light", label: "Street Light" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "samrat", label: "Samrat" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "aboutus",
    label: "About Us",
    path: "/shop/home/#aboutus",
  },
  {
    id: "contact",
    label: "Contact",
    path: "/shop/home/#contact",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  elcb: "ELCB",
  elcbmcb: "ELCB+LCB",
  ol: "Overload",
  timer: "Timer",
  mbs: "Mobile Operated Switch",
  SFG: "Solar Fence Guard",
  dol: "Direct On Line",
  light: "Street Light",
};

export const brandOptionsMap = {
  samrat: "Samtrat",

};

export const filterOptions = {
  category: [
    { id: "elcb", label: "ELCB" },
    { id: "elcbmcb", label: "ELCB+LCB" },
    { id: "ol", label: "Overload" },
    { id: "timer", label: "Timer" },
    { id: "mbs", label: "Mobile Operated Switch" },
    { id: "SFG", label: "Solar Fence Guard" },
    { id: "dol", label: "Direct On Line" },
    { id: "light", label: "Street Light" },
  ],
  brand: [
    { id: "samrat", label: "Samrat" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
