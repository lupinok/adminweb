
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import Widget from "components/widget/Widget";


const Dashboard = () => {
  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Số người học"}
          subtitle={"20"}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Tổng khóa học"}
          subtitle={"20"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Tổng số ngành"}
          subtitle={"6"}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Tổng số câu hỏi:"}
          subtitle={"1,000"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"New Tasks"}
          subtitle={"145"}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Total Projects"}
          subtitle={"$2433"}
        />
      </div>
    </div>
  );
};

export default Dashboard;
