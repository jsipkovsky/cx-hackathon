using { swisslife } from '../db/sl';

service advisorAreas {
    entity AdvisorAreas as projection on swisslife.AdvisorAreas;
    entity SpecialAreas as projection on swisslife.SpecialAreas;
    function getAdvisor (zipCode:String, city:String @Core.OptionalParameter, street:String @Core.OptionalParameter) returns AdvisorAreas;
}