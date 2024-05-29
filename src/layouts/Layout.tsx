import Navbar from "../components/Navbar";
interface childrenProps {
  children: JSX.Element | JSX.Element[];
}

const Layout = ({ children }: childrenProps) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;
