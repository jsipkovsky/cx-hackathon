namespace swisslife;

entity AdvisorAreas {
  key ID : UUID;
  advisorId : String;
  zipCode : String;
  isSpecialAssigment : String;
}

entity SpecialAreas {
  key ID : UUID;
  zipCode : String;
  street : String;
}