namespace swisslife;

entity Employees {
  key EmployeeID : UUID;
  BusinessPartnerID : String;
}

entity Addresses {
  key AddressID : UUID;
  Street : String;
  HouseID : String;
  Postcode : String;
  City : String;
  County : String;
  Country: String;
}

entity EmployeeAddresses {
  key EmployeeAddressID : UUID;
  AddressID : UUID;
  EmployeeID : UUID;
}

entity AreaManagers {
  key AreaManagerID : UUID;
  Postcode : String;
  BusinessPartnerID : String;
}