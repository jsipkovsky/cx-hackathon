using { swisslife } from '../db/sl';
@protocol: 'rest'
service advisorAreas {
    @open
    type object {};
    entity Employees as projection on swisslife.Employees;
    entity Addresses as projection on swisslife.Addresses;
    entity EmployeeAddresses as projection on swisslife.EmployeeAddresses;
    action getAdvisor (data: object) returns object;
}