"use client";
import { useEffect, useRef } from "react";
import {
  SciChartSurface,
  NumericAxis,
  SciChartJsNavyTheme,
  NumberRange,
  FastRectangleRenderableSeries,
  EColumnMode,
  EColumnYMode,
  EDataPointWidthMode,
  EResamplingMode,
  XyxyDataSeries,
  IFillPaletteProvider,
  EFillPaletteMode,
  EStrokePaletteMode,
  IPointMetadata,
  parseColorToUIntArgb,
  IStrokePaletteProvider,
  EVerticalTextPosition,
  EHorizontalTextPosition,
} from "scichart";

import { HierarchyRectangularNode, stratify, treemap } from "d3-hierarchy";

type TreeDataItem = {
  name: string;
  parent: string;
  value: string;
  color?: string;
};

// An example of WASM dependencies URLs configuration to fetch from origin server:
SciChartSurface.configure({
  wasmUrl: "scichart2d.wasm",
  dataUrl: "scichart2d.data",
});

async function initSciChart(
  rootElement: string | HTMLDivElement,
  data: TreeDataItem[]
) {
  // Initialize SciChartSurface. Don't forget to await!
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );

  // Create an XAxis and YAxis with growBy padding
  const growBy = new NumberRange(0.01, 0.01);
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "X Axis",
      growBy,
      isVisible: false,
    })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "Y Axis",
      growBy,
      isVisible: false,
    })
  );

  const yAxis = sciChartSurface.yAxes.get(0);
  yAxis.visibleRange = new NumberRange(0, 10);

  const root = stratify()
    .id(function (d) {
      return (d as TreeDataItem).name;
    })
    .parentId(function (d) {
      return (d as TreeDataItem).parent;
    })(data);

  root.sum(function (d) {
    return +(d as TreeDataItem).value;
  });

  const width = 15;
  const height = 10;

  treemap().size([width, height]).padding(0.1)(root);

  const treemapData = root.leaves();

  console.log(treemapData);

  // const xValues = [0, 5, 10, 40];
  // const yValues = [10, 30, 40, 45];
  // const x1Values = [5, 15, 30, 60];
  // const y1Values = [5, 10, 10, 20];

  const xValues = treemapData.map(
    (d) => (d as HierarchyRectangularNode<unknown>).x1
  );
  const yValues = treemapData.map(
    (d) => (d as HierarchyRectangularNode<unknown>).y1
  );
  const x1Values = treemapData.map(
    (d) => (d as HierarchyRectangularNode<unknown>).x0
  );
  const y1Values = treemapData.map(
    (d) => (d as HierarchyRectangularNode<unknown>).y0
  );

  const metadata = treemapData.map((d) => d.data) as IPointMetadata[];

  console.log({ metadata });

  //FastRectangleRenderableSeries
  // Box Series
  const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
    dataSeries: new XyxyDataSeries(wasmContext, {
      xValues,
      yValues,
      x1Values,
      y1Values,
      metadata,
    }),
    columnXMode: EColumnMode.StartEnd,
    columnYMode: EColumnYMode.TopBottom,
    dataPointWidth: 1,
    dataPointWidthMode: EDataPointWidthMode.Range,
    stroke: "white",
    strokeThickness: 3,
    fill: "#00ff0077",
    // opacity: 0.5,
    defaultY1: 0,
    resamplingMode: EResamplingMode.None,
    topCornerRadius: 5,
    bottomCornerRadius: 5,
    dataLabels: {
      horizontalTextPosition: EHorizontalTextPosition.Center,
      verticalTextPosition: EVerticalTextPosition.Center,
      // positionMode: EColumnDataLabelPosition.Inside,
      style: {
        fontSize: 16,
      },
      color: "#EEE",
      metaDataSelector: (md) => {
        const metadata = md as unknown as TreeDataItem;
        return metadata.name;
      },
    },
    paletteProvider: new FastRectanglePaletteProvider(),
  });

  sciChartSurface.renderableSeries.add(rectangleSeries);

  return { sciChartSurface };
}

class FastRectanglePaletteProvider
  implements IStrokePaletteProvider, IFillPaletteProvider
{
  public readonly fillPaletteMode = EFillPaletteMode.SOLID;
  public readonly strokePaletteMode: EStrokePaletteMode =
    EStrokePaletteMode.SOLID;

  public onAttached(): void {}

  public onDetached(): void {}

  public overrideFillArgb(
    _xValue: number,
    _yValue: number,
    _index: number,
    _opacity?: number,
    metadata?: IPointMetadata
  ): number | undefined {
    return parseColorToUIntArgb(
      (metadata as unknown as TreeDataItem).color ?? "green"
    );
  }

  public overrideStrokeArgb(
    _xValue: number,
    _yValue: number,
    _index: number,
    _opacity?: number,
    metadata?: IPointMetadata
  ): number | undefined {
    return parseColorToUIntArgb(
      (metadata as unknown as TreeDataItem).color ?? "#ffffff"
    );
  }
}

export default function Home({ data }: { data: TreeDataItem[] }) {
  const rootElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initPromise = initSciChart(
      rootElementRef.current as HTMLDivElement,
      data
    );

    return () => {
      initPromise.then(({ sciChartSurface }) => sciChartSurface.delete());
    };
  }, [data]);

  return <div ref={rootElementRef} style={{ width: 900, height: 600 }}></div>;
}
