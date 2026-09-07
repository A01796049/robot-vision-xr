export const CFG={
 CELL:.10, MERGE:.15, MIN_HITS:4, MIN_D:.35, MAX_D:6.5,
 SAMPLE_X:32, SAMPLE_Y:24, MAX_RENDER:24000,
 PLANE_INTERVAL:1400, MIN_CLUSTER:8, MAX_PLANES:28,

 // Plane segmentation
 HORIZONTAL_Y_TOL:.075,
 VERTICAL_AXIS_TOL:.18,
 PLANE_GAP:.24,

 // Stair geometry in meters
 STEP_MIN_RISE:.10,
 STEP_MAX_RISE:.29,
 STEP_MIN_RUN:.12,
 STEP_MAX_RUN:.55,
 STEP_MIN_WIDTH:.28,
 STEP_MAX_HEIGHT_SPREAD:.10,
 STAIR_MIN_STEPS:2
};
export const COLORS={
 horizontal:[.25,1,.42], vertical:[.12,.82,1], inclined:[1,.60,.18], unknown:[.62,.38,1],
 planeHorizontal:[.35,1,.5], planeVertical:[.25,.9,1], planeInclined:[1,.7,.25],
 step:[1,.62,.18], landing:[.35,1,.62], stairs:[1,1,1]
};
