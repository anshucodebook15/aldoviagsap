import { BrowserRouter as Router, Route, Routes } from "react-router";
// import App from "../app/App";
import TestPage from "../test/test";
import Error404 from "../404";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestPage />} />

        {/* Test Routes  */}
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
};

const AppRouter = () => {
  return <AppRoutes />;
};

export default AppRouter;
