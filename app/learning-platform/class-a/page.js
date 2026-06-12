import Quiz from "../../../components/modules/class-a/Quiz";

export const metadata = {
  title: "Class A Practice - TradeSchool OS",
  description:
    "Earning your Ontario Class A commercial driver’s license is the gateway to a rewarding, high-paying career in logistics and heavy transport. But before you can demonstrate your skills behind the wheel during the MTO practical road exam, you must prove you are a master of highway safety.",
  keywords: "Class A, Ontario",
  openGraph: {
    title: "Class A Practice - TradeSchool OS",
    description: "Master the Knowledge Pass Your Road Test the First Time.",
    type: "website",
  },
};

export default function VRARPage() {
  const studentId = "student-123"; // In production, get from authentication

  return <Quiz />;
}
