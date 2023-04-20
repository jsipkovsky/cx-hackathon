import { SapCodes, Messages, leadPath } from './advisorSrvUtils.js';
import findAdvisorForArea from './databaseUtils.js';

export default async (srv)=> {
  const c4c = await cds.connect.to("C4C_Lead");
  const { LeadCollection } = c4c.entities;

  srv.on ('getAdvisorForArea', async req => {
    const advisorId = await findAdvisorForArea(
      req.data.postcode,
      req.data.street,
      req.data.houseId
    );
    return advisorId;
  })

  srv.on ('assignAdvisorForArea', async req => {
    const objectId = req.data?.data?.["root-entity-id"];
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
          // get advisor based on area, if not found use area manager
          const advisorId = await findAdvisorForArea(
            leadEntity.IndividualCustomerAddressPostalCode,
            leadEntity.IndividualCustomerAddressStreetName,
            leadEntity.IndividualCustomerAddressHouseID);
          if(advisorId) {
            const error = await c4c.send({
              method: 'PATCH',
              path: leadPath(objectId),
              data: { OwnerPartyID: advisorId }
            })
            return error
              ? { success: false, message: error }
              : { success: true, message: Messages.leadAssigned(objectId, advisorId) };
          }
          return { success: false, message: Messages.ADVISOR_NOT_FOUND };
        }
      } else {
        return { success: false, message: Messages.LEAD_NOT_FOUND };
      }
    }
    return { success: false, message: Messages.OBJECT_ID_MISSING };
  })
}