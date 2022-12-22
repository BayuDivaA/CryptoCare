import Navbar from "./component/Navbar";
import Welcome from "./component/Welcome";
import Urgent from "./component/Urgent";
import Campaign from "./component/Campaign";
import Services from "./component/Services";
import Footer from "./component/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar showList={true} />
        <Welcome />
        <Urgent />
        <Campaign />
        <Services />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
