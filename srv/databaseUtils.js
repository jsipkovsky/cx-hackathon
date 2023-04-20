const db = await cds.connect.to ('db');
const { Employees, Addresses, EmployeeAddresses, AreaManagers } = db.entities ('swisslife');

export default async function findAdvisorForArea(postcode, street, houseId) {
  let advisor = '';
  let address = await SELECT.one.from(Addresses).where({postcode, street, houseId});
  if(!address) {
    address = await SELECT.one.from(Addresses).where({postcode, street});
  }
  if(address) {
    const employeeAddress = await SELECT.one.from(EmployeeAddresses).where({
      AddressID: address.ID
    });
    const employee = await SELECT.one.from(Employees).where({
      ID: employeeAddress.employeeId
    });
    advisor = employee.businessPartnerId;
  } else {
    const employee = await SELECT.one.from(AreaManagers).where({ postcode });
    advisor = employee?.businessPartnerId;
  }
  return advisor;
};