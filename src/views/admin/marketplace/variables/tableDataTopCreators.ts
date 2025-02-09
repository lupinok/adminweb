type RowObj = {
  name: string;
  email: string;
  password: string;
  role: string;
};

const tableDataTopCreators: RowObj[] = [
  { name: "John Doe", email: "john@example.com", password: "password123", role: "Admin" },
  { name: "Jane Smith", email: "jane@example.com", password: "password456", role: "User" },
  { name: "Alice Johnson", email: "alice@example.com", password: "password789", role: "Editor" },
  { name: "Bob Brown", email: "bob@example.com", password: "password101", role: "Viewer" },
];

export default tableDataTopCreators;
