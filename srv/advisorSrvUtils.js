export const SapCodes = {
  CAMPAIGN: '003',
  RECOMMENDATION: 'Z06',
  STATUS_QUALIFIED: '2',
};

export const Messages = {
  ADVISOR_NOT_FOUND: 'advisor not found',
  LEAD_NOT_FOUND: 'lead not found',
  OBJECT_ID_MISSING: 'object id missing',
  leadAssigned: function(objectId, advisorId) { return `Advisor ${advisorId} assidned to Lead ${objectId}` }
};

export function leadPath(objectId) { return `LeadCollection('${objectId}')` };
