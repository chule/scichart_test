import ChartExample from "./ChartExample";
export default function Home() {

  const data = [
    { name: "Orgin", parent: "", value: "" },
    { name: "grp1", parent: "Orgin", value: "6", color: "green" },
    { name: "grp2", parent: "Orgin", value: "6", color: "red" },
    { name: "grp3", parent: "Orgin", value: "4", color: "green" },
    { name: "grp4", parent: "Orgin", value: "3", color: "red" },
    { name: "grp5", parent: "Orgin", value: "2", color: "green" },
    { name: "grp6", parent: "Orgin", value: "2", color: "red" },
    { name: "grp7", parent: "Orgin", value: "1", color: "green" },
  ];

  return (
    <main>
      <div className="flex flex-row min-h-screen justify-center items-center">
        <ChartExample data={data} />
      </div>
    </main>
  );
}
