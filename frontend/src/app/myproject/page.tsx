import RightNavBar from "@/components/common/RightNavBar";
import MyProjects from "@/components/Projects/MyProjects";

const fakeData: Project[] = [
  {
    title: "Creeper",
    description: "This is the description for Creeper",
    start_date: "2023-01-01",
    end_date: "2023-02-01",
    members: ["John Doe", "Jane Doe"],
  },
  {
    title: "Zombie",
    description: "This is the description for Zombie",
    start_date: "2023-01-01",
    end_date: "2023-02-01",
    members: ["John Doe", "Jane Doe"],
  },
  {
    title: "Skeleton",
    description: "This is the description for Skeleton",
    start_date: "2023-01-01",
    end_date: "2023-02-01",
    members: ["John Doe", "Jane Doe"],
  },
  {
    title: "Creeper",
    description: "This is the description for Creeper",
    start_date: "2023-01-01",
    end_date: "2023-02-01",
    members: ["John Doe", "Jane Doe"],
  },
];

export default function MyProjectsPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex w-[80%] mx-auto">
        <div className="w-[75%] shadow-lg bg-white rounded-lg h-[65vh] p-10">
          <MyProjects fakeData={fakeData} />
        </div>
        <div className="ml-6 w-1/5">
          <RightNavBar />
        </div>
      </div>
    </div>
  );
}
