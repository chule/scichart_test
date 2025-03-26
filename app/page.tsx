import ChartExample from "./ChartExample";

export default function Home() {

  const data = {
    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    yValues: [
      0, 0.0998, 0.1986, 0.2955, 0.3894, 0.4794, 0.5646, 0.6442, 0.7173, 0.7833,
    ],
  };

  return (
    <main>
      <div className="flex flex-row min-h-screen justify-center items-center">
        <ChartExample data={data} />
      </div>
    </main>
  );
}
