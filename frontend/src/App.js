import "@/App.css";
import Portfolio from "@/pages/Portfolio";
import PortfolioV2 from "@/pages/PortfolioV2";
import DevViewport from "@/components/DevViewport";

function App() {
    const isV2 = window.location.search.includes("v2");
    return (
        <DevViewport>
            <div className="App">
                {isV2 ? <PortfolioV2 /> : <Portfolio />}
            </div>
        </DevViewport>
    );
}

export default App;
