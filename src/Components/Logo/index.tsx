import React from "react"

interface LogoProps {
	size: number
}
const Logo: React.FC<LogoProps> = ({ size }) => {
	return <img className={"logo"} alt={"Agrinorm's logo"} src={"/logo.png"} width={size} height={size}/>
}

export default Logo
