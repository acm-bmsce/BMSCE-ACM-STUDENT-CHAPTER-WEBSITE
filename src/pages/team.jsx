import NavBar from "../components/Navbar";
import TeamsHero from "../components/TeamsHero_teams";
import Teams from "../components/Teams_teams";
import TeamContact from "../components/TeamContact_teams";
import Footer from "../components/Footer_about";
import PreviousCoreTeam from "../components/PreviousCoreTeam_teams";

function App() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      <TeamsHero />
      <Teams />
      {/* <TeamContact /> */}
      <PreviousCoreTeam />
      <Footer />
    </main>
  );
}

export default App;
