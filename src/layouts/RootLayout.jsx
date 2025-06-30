import NavBar from "../components/Navbar";


const RootLayout = ({children, headerText}) => {
  return (
    <div>
        <NavBar/>
        <h1>{headerText}</h1>
        <div>{children}</div>
        
    </div>
  );
};

export default RootLayout;