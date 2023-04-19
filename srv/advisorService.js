import SapCodes from './sapCodes.js';

export default async (srv)=>{
  const db = await cds.connect.to ('db');
  const c4c = await cds.connect.to("lead");
  const { Employees, Addresses, EmployeeAddresses, AreaManagers } = db.entities ('swisslife');
    srv.on ('getAdvisor', async req => {
      const { LeadCollection } = c4c.entities;
      const objectId = req.data?.data?.Changes[0]?.nodeID.toString(); // 'E90EF91E52AF1EEDB7D1F9429EB32E03';
      if(objectId) {
        const query = SELECT.one
          .from(LeadCollection)
          .columns((l) => {
            l.EscalationLevel_SDK,
            l.OriginTypeCode,
            l.LifeCycleStatusCode,
            l.IndividualCustomerAddressStreetName,
            l.IndividualCustomerAddressHouseID,
            l.IndividualCustomerAddressCity,
            l.IndividualCustomerAddressPostalCode;
          })
          .where({ ObjectID: objectId });

        const leadEntity = await c4c.run(query);
        if (leadEntity) {
          if((leadEntity.OriginTypeCode == SapCodes.CAMPAIGN ||
              leadEntity.OriginTypeCode == SapCodes.RECOMMENDATION ) &&
              leadEntity.LifeCycleStatusCode == SapCodes.STATUS_QUALIFIED) {
            // Map the address data to employee responsible for the area. If not found, select manager
            let ownerPartyId = null;
            let address = await SELECT.one.from(Addresses).where({
              Postcode: leadEntity.IndividualCustomerAddressPostalCode,
              Street: leadEntity.IndividualCustomerAddressStreetName,
              HouseID: leadEntity.IndividualCustomerAddressHouseID
            });
            if(!address) {
              address = await SELECT.one.from(Addresses).where({
                Postcode: leadEntity.IndividualCustomerAddressPostalCode,
                Street: leadEntity.IndividualCustomerAddressStreetName
              });
            }
            if(address) {
              const employeeAddress = await SELECT.one.from(EmployeeAddresses).where({
                AddressID: address.AddressID
              });
              const employee = await SELECT.one.from(Employees).where({
                EmployeeID: employeeAddress.EmployeeID
              });
              ownerPartyId = employee.BusinessPartnerID;
            } else {
              const employee = await SELECT.one.from(AreaManagers).where({
                Postcode: leadEntity.IndividualCustomerAddressPostalCode
              });
              ownerPartyId = employee.BusinessPartnerID;
            }

            const path = `LeadCollection('${objectId}')`;
            const error = await c4c.send({
              method: 'PATCH',
              path,
              data: { OwnerPartyID: ownerPartyId }
            })
            console.log(error ? error : objectId)
          }
        } else {
          return { success: false };
        }
      }
      return { success: true };
    })
  }