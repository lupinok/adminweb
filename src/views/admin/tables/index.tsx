import TableUser from "./components/TableUser";



const Tables = () => {
  return (
    <div>
      <div className="col-span-1 h-full w-full rounded-xl">
        <TableUser /> {/* Truyền dữ liệu vào đây */}
      </div>
    </div>
  );
};

export default Tables;
