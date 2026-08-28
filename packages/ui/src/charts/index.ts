// Chart context and hooks

// Re-export visx gradient and pattern components for bar fill styling
export {
  GradientDarkgreenGreen,
  GradientLightgreenGreen,
  GradientOrangeRed,
  GradientPinkBlue,
  GradientPinkRed,
  GradientPurpleOrange,
  GradientPurpleTeal,
  GradientSteelPurple,
  GradientTealBlue,
  LinearGradient,
  RadialGradient,
} from "@visx/gradient";
export {
  DEFAULT_ANIMATION_DURATION_MS,
  DEFAULT_ANIMATION_EASING,
  DEFAULT_CHART_ENTER_TRANSITION,
} from "./animation.js";
// Area chart components
export { Area, type AreaProps } from "./area.js";
export { AreaChart, type AreaChartProps } from "./area-chart.js";
export {
  AreaChartLoading,
  type AreaChartLoadingProps,
} from "./area-chart-loading.js";
// Shared chart elements
export { Background, type BackgroundProps } from "./background.js";
// Bar chart components
export {
  Bar,
  type BarAnimationType,
  type BarLineCap,
  type BarProps,
} from "./bar.js";
export { BarChart, type BarChartProps, type BarOrientation } from "./bar-chart.js";
// Bar chart loading skeleton (a `status="loading"` shortcut)
export {
  BarChartLoading,
  type BarChartLoadingProps,
} from "./bar-chart-loading.js";
// Bar 3D depth + glass surfaces (composable layers for BarChart)
export {
  BarDepthBack,
  type BarDepthBackProps,
  type BarDepthEntry,
  BarDepthFront,
  type BarDepthFrontProps,
  BarDepthProvider,
  type BarDepthProviderProps,
  type BarDepthSegment,
  BarPulse,
  type BarPulseProps,
  useBarDepthEntries,
} from "./bar-depth.js";
export {
  BarColumnTrack,
  type BarColumnTrackProps,
  BarSquares,
  type BarSquaresProps,
  type GradientStop,
} from "./bar-squares.js";
export {
  computeSquareColumn,
  type SquareColumnLayout,
  topSquareCenterY,
} from "./bar-squares-layout.js";
export { BarXAxis, type BarXAxisProps } from "./bar-x-axis.js";
export { BarYAxis, type BarYAxisProps } from "./bar-y-axis.js";
export { Candlestick, type CandlestickProps } from "./candlestick.js";
export {
  CandlestickChart,
  type CandlestickChartProps,
  type OHLCDataPoint,
} from "./candlestick-chart.js";
export {
  ChartBrush,
  type ChartBrushProps,
  type ChartBrushSelection,
} from "./chart-brush.js";
export {
  ChartBrushLayout,
  type ChartBrushLayoutProps,
  type ChartBrushLayoutState,
} from "./chart-brush-layout.js";
export {
  type ChartBrushPatternPreset,
  ChartBrushSelectionOverlay,
  type ChartBrushSelectionOverlayProps,
  type ChartBrushSelectionPattern,
} from "./chart-brush-selection-overlay.js";
export {
  ChartBrushTrackOverlay,
  type ChartBrushTrackOverlayProps,
  type ChartBrushTrackOverlayStyle,
} from "./chart-brush-track-overlay.js";
export {
  chartCenterContainerClassName,
  chartCenterLabelClassName,
  chartCenterValueClassName,
} from "./chart-center-typography.js";
export { CHART_CLIP_PASSTHROUGH } from "./chart-child-passthrough.js";
export {
  ChartConfigProvider,
  type ChartConfigProviderProps,
  type ChartConfigValue,
  DEFAULT_CHART_CONFIG,
  resolveTooltipBoxMotion,
  type SpringConfig,
  useChartConfig,
} from "./chart-config-context.js";
export {
  type ChartContextValue,
  type ChartHoverContextValue,
  ChartProvider,
  type ChartStableContextValue,
  chartCssVars,
  defaultScatterColors,
  type LineConfig,
  type Margin,
  type TooltipData,
  useChart,
  useChartHover,
  useChartStable,
  useYScale,
} from "./chart-context.js";
// Legacy legend component (backward compatibility)
export {
  ChartLegend,
  type ChartLegendProps,
  type LegendItem,
} from "./chart-legend.js";
export {
  ChartLegendHoverProvider,
  useChartLegendHover,
} from "./chart-legend-hover.js";
export {
  ChartLoadingLabel,
  type ChartLoadingLabelProps,
} from "./chart-loading-label.js";
export {
  type ChartPhase,
  type ChartStatus,
  DEFAULT_CHART_LIFECYCLE,
  DEFAULT_CHART_STATUS,
  DEFAULT_Y_DOMAIN_TWEEN_MS,
  isChartInteractionPhase,
  type LoadingStyle,
  resolveRestingChartPhase,
} from "./chart-phase.js";
export {
  ChartRevealClip,
  type ChartRevealClipProps,
} from "./chart-reveal-clip.js";
export {
  CHART_SCALE_VARS,
  type ChartScaleVars,
  chartScaleCssVars,
} from "./chart-scale.js";
export {
  ChartStatFlow,
  type ChartStatFlowFormat,
  type ChartStatFlowProps,
  defaultChartStatFlowFormat,
} from "./chart-stat-flow.js";
// Choropleth chart components
export {
  ChoroplethChart,
  type ChoroplethChartProps,
  type ChoroplethContextValue,
  type ChoroplethFeature,
  ChoroplethFeatureComponent,
  type ChoroplethFeatureProperties,
  type ChoroplethFeatureProps,
  ChoroplethGraticule,
  type ChoroplethGraticuleProps,
  ChoroplethProvider,
  ChoroplethTooltip,
  type ChoroplethTooltipData,
  type ChoroplethTooltipProps,
  choroplethCssVars,
  defaultChoroplethColors,
  type TransformMatrix,
  useChoropleth,
  useChoroplethZoom,
} from "./choropleth/index.js";
// Composed time-series (line + area + SeriesBar on shared time scale)
export {
  ComposedChart,
  type ComposedChartProps,
} from "./composed-chart.js";
// Funnel chart components
export {
  FunnelChart,
  type FunnelChartProps,
  type FunnelGradientStop,
  type FunnelStage,
} from "./funnel-chart.js";
// Gauge chart
export { Gauge, type GaugeOrientation, type GaugeProps } from "./gauge.js";
export type {
  GaugeLabelAlign,
  GaugeLabelPlacement,
} from "./gauge-label-layout.js";
export {
  type GenerateChartSkeletonDataOptions,
  generateChartSkeletonData,
} from "./generate-chart-skeleton-data.js";
export { Grid, type GridProps } from "./grid.js";
// Heatmap chart components
export {
  buildHeatmapColorScale,
  buildHeatmapColorScaleFromStyles,
  buildHeatmapFillScale,
  buildHeatmapLegendGradient,
  buildHeatmapRowOpacity,
  defaultHeatmapColorScale,
  defaultHeatmapFillScale,
  filterHeatmapColumns,
  formatHeatmapContributionLabel,
  formatHeatmapTooltipDate,
  formatHeatmapTooltipWeekday,
  formatHeatmapYAxisLabel,
  getHeatmapCalendarRangeStart,
  getHeatmapColumnMonthAnchor,
  getHeatmapDayLabels,
  getHeatmapSeparatorColumnIndices,
  getHeatmapTimeExtent,
  getHeatmapWeekCount,
  getHeatmapWeekStartAlignedToRange,
  getHeatmapWeekStartSunday,
  getHeatmapYearStartMonth,
  HEATMAP_DAY_LABELS,
  HEATMAP_DEFAULT_LEVEL_COLORS,
  HEATMAP_DEFAULT_LEVEL_STYLES,
  HEATMAP_LEGEND_LEVELS,
  HEATMAP_MONTHS_ONE_YEAR,
  HEATMAP_MONTHS_SIX,
  HEATMAP_WEEKS_ONE_YEAR,
  type HeatmapBin,
  HeatmapCells,
  type HeatmapCellsProps,
  HeatmapChart,
  HeatmapChartLoading,
  type HeatmapChartLoadingProps,
  type HeatmapChartProps,
  type HeatmapColumn,
  type HeatmapContextValue,
  HeatmapInteractionBoundary,
  HeatmapInteractionProvider,
  type HeatmapLayout,
  HeatmapLegend,
  type HeatmapLegendProps,
  type HeatmapLegendVariant,
  type HeatmapLevelColors,
  type HeatmapLevelFillMode,
  type HeatmapLevelStyle,
  type HeatmapLevelStyles,
  HeatmapProvider,
  HeatmapSeparator,
  type HeatmapSeparatorProps,
  HeatmapTooltip,
  type HeatmapTooltipProps,
  type HeatmapWeekRange,
  type HeatmapWeekStartDay,
  HeatmapXAxis,
  type HeatmapXAxisProps,
  HeatmapYAxis,
  type HeatmapYAxisLabelFormat,
  type HeatmapYAxisProps,
  type HeatmapYAxisTickFilter,
  heatmapCssVars,
  heatmapLevelPatternId,
  inferHeatmapCalendarRangeStart,
  isHeatmapLevelPattern,
  levelColorsFromStyles,
  levelStylesFromColors,
  resolveHeatmapLevelStyles,
  resolveHeatmapWeekRange,
  shouldShowHeatmapYAxisTick,
  useHeatmap,
} from "./heatmap/index.js";
export {
  type IndicatorFadeEdges,
  indicatorFadeGradientStops,
  resolveVerticalFadeSides,
} from "./indicator-fade.js";
// Composable legend components
export {
  Legend,
  type LegendContextValue,
  LegendItem as LegendItemComponent,
  type LegendItemContextValue,
  type LegendItemData,
  type LegendItemProps,
  LegendLabel,
  type LegendLabelProps,
  LegendMarker,
  type LegendMarkerProps,
  LegendProgress,
  type LegendProgressProps,
  type LegendProps,
  LegendValue,
  type LegendValueProps,
  legendCssVars,
  useLegend,
  useLegendItem,
} from "./legend/index.js";
// Line chart components
export { Line, type LineProps } from "./line.js";
export { LineChart, type LineChartProps } from "./line-chart.js";
export {
  LineChartLoading,
  type LineChartLoadingProps,
} from "./line-chart-loading.js";
export {
  type LineLoadingPulseMode,
  LineLoadingPulseStroke,
  type LineLoadingPulseStrokeProps,
  resolveLineLoadingPulseMode,
} from "./line-loading-pulse.js";
export {
  LineSeriesTerminalMarker,
  type LineSeriesTerminalMarkerProps,
} from "./line-series-terminal-marker.js";
export {
  detectMomentum,
  LiveLine,
  type LiveLineProps,
  type Momentum,
  type MomentumColors,
} from "./live-line.js";
// Live line chart (real-time streaming)
export {
  LiveLineChart,
  type LiveLineChartProps,
  type LiveLinePoint,
} from "./live-line-chart.js";
export { LiveXAxis, type LiveXAxisProps } from "./live-x-axis.js";
export { LiveYAxis, type LiveYAxisProps } from "./live-y-axis.js";
// Sweep loading visuals: `loadingStyle="sweep"` on Line/Area + bar skeleton
export {
  BarLoadingSkeleton,
  type BarLoadingSkeletonProps,
  getSkeletonHeights,
  LineLoadingSweep,
  type LineLoadingSweepProps,
} from "./loading-sweep.js";
// Marker components
export {
  type ChartMarker,
  ChartMarkers,
  type ChartMarkersProps,
  MarkerGroup,
  type MarkerGroupProps,
  MarkerTooltipContent,
  type MarkerTooltipContentProps,
  useActiveMarkers,
} from "./markers/index.js";
export { PatternArea, type PatternAreaProps } from "./pattern-area.js";
export {
  isCirclePattern,
  isCirclesPattern,
  PATTERN_PRESET_IDS,
  type PatternPresetId,
  type PatternPresetOptions,
  patternPresetTileSize,
  renderPatternPreset,
} from "./pattern-preset.js";
// Pie chart components
export { PieCenter, type PieCenterProps } from "./pie-center.js";
export {
  PieCenterShell,
  type PieCenterShellProps,
} from "./pie-center-shell.js";
export {
  DEFAULT_HOVER_OFFSET,
  PieChart,
  type PieChartProps,
} from "./pie-chart.js";
export {
  defaultPieColors,
  type PieArcData,
  type PieContextValue,
  type PieData,
  PieProvider,
  pieCssVars,
  usePie,
  usePieHover,
  usePieStable,
} from "./pie-context.js";
export {
  PieSlice,
  type PieSliceHoverEffect,
  type PieSliceProps,
} from "./pie-slice.js";
// Profit/loss line (sign-colored segments on LineChart)
export {
  PROFIT_LOSS_LEGEND_ITEMS,
  ProfitLossLegend,
  type ProfitLossLegendProps,
} from "./profit-loss-legend.js";
export {
  ProfitLossLegendHoverProvider,
  useProfitLossLegendHover,
} from "./profit-loss-legend-hover.js";
export {
  PROFIT_LOSS_NEGATIVE_COLOR,
  PROFIT_LOSS_POSITIVE_COLOR,
  PROFIT_LOSS_TOOLTIP_LABEL_FALLBACK,
  ProfitLossLine,
  type ProfitLossLineProps,
  profitLossColor,
  resolveProfitLossTooltipLabel,
} from "./profit-loss-line.js";
export {
  type ProfitLossSegment,
  splitProfitLossSegments,
} from "./profit-loss-segments.js";
export {
  extractProjectionLineConfigs,
  mergeProjectionXDomainMax,
  mergeProjectionYDomain,
  type ProjectionLineConfig,
} from "./projection-config.js";
export {
  ProjectionLine,
  type ProjectionLineProps,
  type ProjectionStrokeStyle,
} from "./projection-line.js";
export {
  ProjectionLineEndMarker,
  type ProjectionLineEndMarkerProps,
} from "./projection-line-end-marker.js";
export {
  type BuildProjectionPathOptions,
  buildHorizontalTangentBezierPath,
  buildProjectionPath,
  computeProjectionAnchorTangentSlope,
  type ProjectionAutoMethod,
  type ProjectionCurveKind,
  type ProjectionMode,
  type ProjectionPathDensity,
  type ProjectionPoint,
  projectionDateExtents,
  projectionValueExtents,
} from "./projection-utils.js";
// Radar chart components
export { RadarArea, type RadarAreaProps } from "./radar-area.js";
export { RadarAxis, type RadarAxisProps } from "./radar-axis.js";
export { RadarChart, type RadarChartProps } from "./radar-chart.js";
export {
  defaultRadarColors,
  type RadarContextValue,
  type RadarData,
  type RadarMetric,
  RadarProvider,
  radarCssVars,
  useRadar,
  useRadarHover,
  useRadarStable,
} from "./radar-context.js";
export { RadarGrid, type RadarGridProps } from "./radar-grid.js";
export { RadarLabels, type RadarLabelsProps } from "./radar-labels.js";
export {
  ReferenceArea,
  type ReferenceAreaProps,
  type ReferenceAreaStrokeStyle,
} from "./reference-area.js";
export {
  computeReferenceAreaRect,
  type ReferenceAreaIfOverflow,
  type ReferenceAreaRect,
} from "./reference-area-geometry.js";
// Ring chart components
export { Ring, type RingLineCap, type RingProps } from "./ring.js";
export { RingCenter, type RingCenterProps } from "./ring-center.js";
export { RingChart, type RingChartProps } from "./ring-chart.js";
export {
  defaultRingColors,
  type RingContextValue,
  type RingData,
  RingProvider,
  ringCssVars,
  useRing,
  useRingHover,
  useRingStable,
} from "./ring-context.js";
// Sankey chart components
export {
  SankeyChart,
  type SankeyChartProps,
  type SankeyContextValue,
  type SankeyData,
  type SankeyLabelOrientation,
  SankeyLink,
  type SankeyLinkDatum,
  type SankeyLinkProps,
  SankeyNode,
  type SankeyNodeDatum,
  type SankeyNodeProps,
  SankeyProvider,
  SankeyTooltip,
  type SankeyTooltipData,
  type SankeyTooltipProps,
  sankeyCssVars,
  useSankey,
} from "./sankey/index.js";
// Scatter chart components
export { Scatter, type ScatterProps } from "./scatter.js";
export { ScatterChart, type ScatterChartProps } from "./scatter-chart.js";
// Segment selection components
export {
  SegmentBackground,
  type SegmentBackgroundProps,
  SegmentLineFrom,
  type SegmentLineProps,
  SegmentLineTo,
  type SegmentLineVariant,
} from "./segment.js";
// Series bar (time-based columns for ComposedChart)
export { SeriesBar, type SeriesBarProps } from "./series-bar.js";
export {
  SeriesMarkers,
  type SeriesMarkersProps,
} from "./series-markers.js";
export {
  getSeriesMarkerVisualExtent,
  SeriesPointMarker,
  type SeriesPointMarkerProps,
  type SeriesPointMarkerStyle,
} from "./series-point-marker.js";
export {
  StaticChartPreviewProvider,
  useStaticChartPreview,
} from "./static-chart-preview-context.js";
export {
  type ArcDatum,
  type ArcGeometry,
  arcPath,
  buildArcs,
  buildRevealDelays,
  buildRevealSchedule,
  buildSunburstEnterTiming,
  centroidAngle,
  clockwiseFraction,
  defaultSunburstGrowPadding,
  type Focus,
  geomCentroidAngle,
  geomCentroidRadius,
  geometryFor,
  lerpGeometry,
  localProgress,
  ringOptions,
  type SunburstEnterTiming,
  type SunburstRevealSchedule,
  type SunburstSegmentEnterDelays,
  segmentRevealFromRingSweep,
  sumValues,
  transitionGeometry,
} from "./sunburst.js";
// Sunburst chart components
export {
  SunburstBreadcrumb,
  type SunburstBreadcrumbItem,
  type SunburstBreadcrumbProps,
  useSunburstBreadcrumbItems,
} from "./sunburst-breadcrumb.js";
export { SunburstCenter, type SunburstCenterProps } from "./sunburst-center.js";
export { SunburstChart, type SunburstChartProps } from "./sunburst-chart.js";
export {
  defaultSunburstColors,
  opacityForRelativeDepth,
  sunburstCssVars,
  useSunburstHover,
  useSunburstStable,
} from "./sunburst-context.js";
export type { SunburstNode } from "./sunburst-data.js";
export {
  SunburstHint,
  type SunburstHintContext,
  type SunburstHintProps,
} from "./sunburst-hint.js";
export { SunburstLabels, type SunburstLabelsProps } from "./sunburst-labels.js";
export { SunburstSegment, type SunburstSegmentProps } from "./sunburst-segment.js";
// Tooltip components
export {
  ChartTooltip,
  type ChartTooltipProps,
  DateTicker,
  type DateTickerProps,
  type IndicatorWidth,
  TooltipBox,
  type TooltipBoxProps,
  TooltipContent,
  type TooltipContentProps,
  TooltipDot,
  type TooltipDotProps,
  TooltipIndicator,
  type TooltipIndicatorProps,
  type TooltipRow,
} from "./tooltip/index.js";
export { useAnimatedYDomains } from "./use-animated-y-domains.js";
// Chart interaction hook
export {
  type ChartSelection,
  useChartInteraction,
} from "./use-chart-interaction.js";
export {
  PatternCircles,
  PatternHexagons,
  PatternLines,
  PatternWaves,
} from "./visx-pattern.js";
export { XAxis, type XAxisProps } from "./x-axis.js";
export { YAxis, type YAxisProps } from "./y-axis.js";
export {
  DEFAULT_Y_AXIS_ID,
  getPrimaryYScale,
  type YAxisOrientation,
} from "./y-axis-scales.js";
export {
  resolveYAxisTickCount,
  Y_AXIS_DEFAULT_TICK_COUNT,
  Y_AXIS_MAX_TICK_COUNT,
  Y_AXIS_MIN_TICK_COUNT,
} from "./y-axis-ticks.js";
export {
  computeYDomainsByAxis,
  isLoadingChromePhase,
  isYDomainTweenPhase,
  mergeYDomainRecords,
  niceYDomain,
  shouldTweenYDomain,
  type YDomain,
} from "./y-domain-utils.js";
