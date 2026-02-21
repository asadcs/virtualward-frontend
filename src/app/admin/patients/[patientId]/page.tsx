// import PatientDetailClient from "./PatientDetailClient";

// export default async function PatientDetailPage({
//   params,
// }: {
//   params: Promise<{ patientId: string }>;
// }) {
//   const { patientId } = await params; // ✅ unwrap async params on server
//   return <PatientDetailClient patientId={patientId} />;
// }

import PatientDetailClient from "./PatientDetailClient";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params; // ✅ unwrap async params on server
  return <PatientDetailClient patientId={patientId} />;
}
