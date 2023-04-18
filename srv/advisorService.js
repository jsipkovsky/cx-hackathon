module.exports = async (srv)=>{
  const db = await cds.connect.to ('db');
  const c4c = await cds.connect.to("lead");
  const { AdvisorAreas, SpecialAreas } = db.entities ('swisslife');
    srv.on ('getAdvisor', async req => {
      const { LeadCollection } = c4c.entities;
      const customerId = '1592726';
      const query = SELECT.one
        .from(LeadCollection)
        // .columns((c) => {
        //   c.ID, c.ObjectID, c.QualificationLevelCode;
        // })
        .where({ ID: customerId.toString() });

      const c4cCustomer = await c4c.run(query);
      if (c4cCustomer) {
        console.log("OK");
      } else {
        return '';
      }
      const specialArea = await SELECT.one.from(SpecialAreas).where({
        zipCode:req.data.zipCode,
        street:req.data.street
      });
      const advisorArea = await SELECT.one.from(AdvisorAreas).where({
        zipCode:req.data.zipCode,
        isSpecialAssigment: !specialArea ? 'false' : 'true'
      });
      return advisorArea;
    })
  }