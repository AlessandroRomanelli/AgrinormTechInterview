import axios from "axios";

const APICaller = axios.create({
	baseURL: "http://localhost:3001",
	timeout: 1000
})

export default APICaller
