using { swisslife } from '../db/sl';
@protocol: 'rest'
service advisorAreas {
    @open
    type object {};
    entity AdvisorAreas as projection on swisslife.AdvisorAreas;
    entity SpecialAreas as projection on swisslife.SpecialAreas;
    action getAdvisor (data: object) returns AdvisorAreas;
}