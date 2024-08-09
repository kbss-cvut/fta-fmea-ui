const _NS_FTA_FMEA = "http://onto.fel.cvut.cz/ontologies/fta-fmea-application/";
const _NS_FOAF = "http://xmlns.com/foaf/0.1/";
const DC_TERMS = "http://purl.org/dc/terms/";

export default {
  PREFIX: _NS_FTA_FMEA,
  DC_TERMS: DC_TERMS,
  USER: _NS_FOAF + "Person",
  USERNAME: _NS_FOAF + "accountName",
  COMPONENT: _NS_FTA_FMEA + "component",
  MITIGATION: _NS_FTA_FMEA + "mitigation",
  FUNCTION: _NS_FTA_FMEA + "function",
  FAULT_EVENT: _NS_FTA_FMEA + "fault-event",
  FAILURE_MODE: _NS_FTA_FMEA + "failure-mode",
  RPN: _NS_FTA_FMEA + "risk-priority-number",
  FAULT_TREE: _NS_FTA_FMEA + "fault-tree",
  SYSTEM: _NS_FTA_FMEA + "system",
  FAILURE_MODES_TABLE: _NS_FTA_FMEA + "failure-modes-table",
  FAILURE_MODES_ROW: _NS_FTA_FMEA + "failure-modes-row",
  OPERATIONAL_DATA_FILTER: _NS_FTA_FMEA + "operational-data-filter",
};
