import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import ManagementPage from "./Pages/ManagementPage";
import InspectorPage from "./Pages/InspectorPage";
import {Container} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./Navbar";
import LandingPage from "./Pages/LandingPage";

import "./animista.css"

function App() {
	return (
		<Router>
			<Navbar/>
			<Container className="App">
				<Routes>
					<Route path={'/'} element={<LandingPage/>}/>
					<Route path={'/inspector'} element={<InspectorPage/>}/>
					<Route path={'/management'} element={<ManagementPage/>}/>
				</Routes>
			</Container>
		</Router>

	);
}

export default App;
