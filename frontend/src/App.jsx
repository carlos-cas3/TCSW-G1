import { useState } from "react";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <section id="center">
                <div>
                    <h1 class="text-3xl font-bold text-blue-500">
                        Tailwind + Vite
                    </h1>
                    <p>
                        Edit <code>src/App.jsx</code> and save to test{" "}
                        <code>HMR</code>
                    </p>
                </div>
                <button
                    type="button"
                    className="counter"
                    onClick={() => setCount((count) => count + 1)}
                >
                    Count is {count}
                </button>
            </section>

            <div className="ticks"></div>

            <div className="ticks"></div>
            <section id="spacer"></section>
        </>
    );
}

export default App;
