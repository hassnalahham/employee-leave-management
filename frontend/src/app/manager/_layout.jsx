import Layout from "../../components/Layout";

export default function ManagerLayout() {
  return (
    <Layout
      title="Manager Portal"
      links={[{ to: "/manager", label: "All requests", end: true }]}
    />
  );
}
