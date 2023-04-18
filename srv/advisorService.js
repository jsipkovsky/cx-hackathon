module.exports = async (srv)=>{
  const db = await cds.connect.to ('db');
  const { AdvisorAreas, SpecialAreas } = db.entities ('swisslife');
    srv.on ('getAdvisor', async req => {
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