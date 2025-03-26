"use client";
import { useEffect, useRef } from "react";
import {
  SciChart3DSurface,
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  EllipsePointMarker,
  SweepAnimation,
  SciChartJsNavyTheme,
  NumberRange,
} from "scichart";

// Make sure the proper configurations are applied on the client side !

// An example of WASM dependencies URLs configuration to fetch from origin server:
SciChartSurface.configure({
  wasmUrl: "scichart2d.wasm",
  dataUrl: "scichart2d.data",
});

SciChart3DSurface.configure({
  wasmUrl: "scichart3d.wasm",
  dataUrl: "scichart3d.data",
});
////


type dataType = {
  xValues: number[];
  yValues: number[];
};

async function initSciChart(
  rootElement: string | HTMLDivElement,
  data: dataType
) {
  // Initialize SciChartSurface. Don't forget to await!
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: new SciChartJsNavyTheme(),
      title: "SciChart.js First Chart",
      titleStyle: { fontSize: 22 },
    }
  );

  // Create an XAxis and YAxis with growBy padding
  const growBy = new NumberRange(0.1, 0.1);
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, { axisTitle: "X Axis", growBy })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, { axisTitle: "Y Axis", growBy })
  );

  // Create a line series with some initial data
  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      stroke: "steelblue",
      strokeThickness: 3,
      dataSeries: new XyDataSeries(wasmContext, {
        xValues: data.xValues,
        yValues: data.yValues,
      }),
      pointMarker: new EllipsePointMarker(wasmContext, {
        width: 11,
        height: 11,
        fill: "#fff",
      }),
      animation: new SweepAnimation({ duration: 300, fadeEffect: true }),
    })
  );

  return { sciChartSurface };
}

export default function Home({ data }: { data: dataType }) {
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
