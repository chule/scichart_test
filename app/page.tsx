import ChartExample from "./ChartExample";
export default function Home() {

  const data = [
    { name: "Orgin", parent: "", value: "" },
    { name: "Electronics", parent: "Orgin", value: "6", color: "darkgreen" },
    { name: "Home Appliances", parent: "Orgin", value: "6", color: "darkred" },
    { name: "Clothing", parent: "Orgin", value: "4", color: "darkgreen" },
    { name: "Books", parent: "Orgin", value: "3", color: "darkred" },
    { name: "Health & Beauty", parent: "Orgin", value: "2", color: "darkgreen" },
    { name: "Sports & Outdoors", parent: "Orgin", value: "2", color: "darkred" },
    { name: "Toys", parent: "Orgin", value: "1", color: "darkgreen" },
  ];

  return (
    <main>
      <div className="flex flex-row min-h-screen justify-center items-center">
        <ChartExample data={data} />
      </div>
    </main>
  );
}
