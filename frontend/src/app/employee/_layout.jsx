import Layout from "../../components/Layout";

export default function EmployeeLayout() {
  return (
    <Layout
      title="Employee Portal"
      links={[
        { to: "/employee", label: "My requests", end: true },
        { to: "/employee/new", label: "New request" },
      ]}
    />
  );
}
