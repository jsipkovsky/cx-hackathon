using { swisslife } from '../db/sl';
@protocol: 'rest'
service advisorAreas {
    @open
    type object {};
    action assignAdvisorForArea (data: object) returns object;
    function getAdvisorForArea (postcode:String, houseId:String @Core.OptionalParameter, street:String @Core.OptionalParameter) returns String;
}