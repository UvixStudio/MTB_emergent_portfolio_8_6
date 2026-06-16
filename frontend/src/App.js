import "@/App.css";
import Portfolio from "@/pages/Portfolio";
import DevViewport from "@/components/DevViewport";

function App() {
    return (
        <div className="App">
            <DevViewport>
                <Portfolio />
            </DevViewport>
        </div>
    );
}

export default App;
