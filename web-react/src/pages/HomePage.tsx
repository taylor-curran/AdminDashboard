import { Statistics } from "../components/Statistics";

export function HomePage() {
  return (
    <>
      <div className="title-container">
        <h1 className="title">Home</h1>
      </div>
      <div className="home-container">
        <h2>Welcome back, Admin!</h2>
        <p>Here&apos;s a quick overview of your orders and users in the last 30 days.</p>
        <Statistics />
      </div>
    </>
  );
}
