namespace swisslife;

entity Employees {
  key ID : UUID;
  businessPartnerId : String;
}

entity Addresses {
  key ID : UUID;
  street : String;
  houseId : String;
  postcode : String;
  city : String;
  county : String;
  country: String;
}

entity EmployeeAddresses {
  key ID : UUID;
  addressId : UUID;
  employeeId : UUID;
}

entity AreaManagers {
  key ID : UUID;
  postcode : String;
  businessPartnerId : String;
}