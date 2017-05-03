import { List, Map } from 'immutable';

// TORQUE AND DRAG APPS
import tndOverview from './torqueAndDrag/overview';
import tndBroomstick from './torqueAndDrag/broomstick';
import tndAxialLoad from './torqueAndDrag/axialLoad';
import tndDownholeTransfer from './torqueAndDrag/downholeTransfer';
import tndFrictionFactor from './torqueAndDrag/frictionFactor';
import tndStress from './torqueAndDrag/stress';
import tndTorque from './torqueAndDrag/torque';

// DRILLING EFFICIENCY APPS
import deDPFounder from './drillingEfficiency/dpFounder';
import deMSEHeatmap from './drillingEfficiency/mseHeatmap';
import deMSEVDepth from './drillingEfficiency/mseVDepth';
import deOptimization from './drillingEfficiency/optimization';
import deROPHeatmap from './drillingEfficiency/ropHeatmap';
import deWOBFounder from './drillingEfficiency/wobFounder';

// DIRECTIONAL APPS
import diTrend from './directional/trend';
import diAccuracy from './directional/accuracy';
import diWellPlan from './directional/wellPlan';
import diToolFaceOrientation from './directional/toolFaceOrientation';
import diSlideSheet from './directional/slideSheet';
import diTortuosityIndex from './directional/tortuosityIndex';
import diSurveys from './directional/surveys';
import diPrev300 from './directional/prev300';

// TRACE APPS
import singleTrace from './trace/singleTrace';
import multiTrace from './trace/multiTrace';
import traceTab from './trace/traceTab';
import traces from './trace/traces';

// SETTINGS APPS
import generalInfo from './settings/generalInfo';
import drillstrings from './settings/drillstrings';
import casing from './settings/casing';
import actualSurveys from './settings/surveys/actual';
import planSurveys from './settings/surveys/plan';
import fluidChecks from './settings/fluidChecks';
import costs from './settings/costs';
import map from './settings/map';
import formations from './settings/formations';
import crewsContact from './settings/crewsContact';
import nptEvents from './settings/nptEvents';
import dailyReports from './settings/dailyReports';
import wellSections from './settings/wellSections';
import operationSummaries from './settings/operationSummaries';
import surfaceEquipment from './settings/surfaceEquipment';

// CONTROL APPS
import wellTimeline from './wellTimeline';

// ANALYTICS APPS
import raRigActivity from './rigActivity/rigActivity';
import raDrillingOperations from './rigActivity/drillingOperations';
import raDepthVersusDays from './rigActivity/depthVersusDays';
import raRigScorecard from './rigActivity/rigScorecard';
import raRopPerformance from './rigActivity/ropPerformance';

// HYDRAULICS APPS
import hydraulicsBedHeight from './hydraulics/bedHeight';
import hydraulicsConcentration from './hydraulics/concentration';
import hydraulicsMinimumFlowRate from './hydraulics/minimumFlowRate';
import hydraulicsOverview from './hydraulics/overview';
import hydraulicsPressureLoss from './hydraulics/pressureLoss';
import hydraulicsPressureTrend from './hydraulics/pressureTrend';

// PDM
import pdmOperatingCondition from './pdm/operatingCondition';
import pdmOverview from './pdm/overview';
import pdmStallsHistory from './pdm/stallsHistory';

// Apps that can be displayed on dashboard / asset pages, keyed by app type
export const uiApps = Map({
  torqueAndDrag: Map({
    title: 'Torque & Drag',
    subtitle: 'Downhole torque and drag',
    appTypes: Map({
      overview: tndOverview,
      broomstick: tndBroomstick,
      axialLoad: tndAxialLoad,
      downholeTransfer: tndDownholeTransfer,
      frictionFactor: tndFrictionFactor,
      stress: tndStress,
      torque: tndTorque
    })
  }),
  drillingEfficiency: Map({
    title: 'Drilling Efficiency',
    subtitle: 'Downhole drilling efficiency',
    appTypes: Map({
      dpFounder: deDPFounder,
      mseHeatmap: deMSEHeatmap,
      mseVDepth: deMSEVDepth,
      optimization: deOptimization,
      ropHeatmap: deROPHeatmap,
      wobFounder: deWOBFounder,
    })
  }),
  directional: Map({
    title: 'Directional',
    subtitle: 'Directional',
    appTypes: Map({
      trend: diTrend,
      accuracy: diAccuracy,
      wellPlan: diWellPlan,
      toolFaceOrientation: diToolFaceOrientation,
      slideSheet: diSlideSheet,
      surveys: diSurveys,
      prev300: diPrev300,
      tortuosityIndex: diTortuosityIndex
    })
  }),
  trace: Map({
    title: 'Trace',
    subtitle: '',
    appTypes: Map({
      singleTrace,
      multiTrace,
      traceTab,
      traces
    })
  }),
  settings: Map({
    title: 'Settings',
    subtitle: '',
    appTypes: Map({
      generalInfo,
      drillstrings,
      casing,
      actualSurveys,
      planSurveys,
      fluidChecks,
      costs,
      map,
      formations,
      crewsContact,
      nptEvents,
      dailyReports,
      wellSections,
      operationSummaries,
      surfaceEquipment
    })
  }),
  rigActivity: Map({
    title: 'Rig Activity',
    subtitle: '',
    appTypes: Map({
      rigActivity: raRigActivity,
      drillingOperations: raDrillingOperations,
      depthVersusDays: raDepthVersusDays,
      rigScorecard: raRigScorecard
    })
  }),
  analytics: Map({
    title: 'Analytics',
    subtitle: '',
    appTypes: Map({
      ropPerformance: raRopPerformance
    })
  }),
  hydraulics: Map({
    title: 'Hydraulics',
    subtitle: '',
    appTypes: Map({
      bedHeight: hydraulicsBedHeight,
      concentration: hydraulicsConcentration,
      minimumFlowRate: hydraulicsMinimumFlowRate,
      overview: hydraulicsOverview,
      pressureLoss: hydraulicsPressureLoss,
      pressureTrend: hydraulicsPressureTrend
    })
  }),
  pdm: Map({
    title: 'PDM',
    subtitle: '',
    appTypes: Map({
      operatingCondition: pdmOperatingCondition,
      overview: pdmOverview,
      stallsHistory: pdmStallsHistory
    })
  })
});

// Apps that are used as control UIs on asset pages, keyed by asset type
export const controlApps = Map({
  well: List([wellTimeline])
});
