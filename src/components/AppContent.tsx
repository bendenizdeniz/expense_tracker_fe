import { Content } from "antd/lib/layout/layout";
import { Route } from "react-router-dom";
import Categories from "./Categories";
import Login from "./Login";
import Logout from "./Logout";
import PrivateRoute from "./PrivateRoute";
import Record from "./Record";
import SignUp from "./SignUp";

function AppContent() {
  return (
    <div>
      <Content
        className="site-layout"
        style={{ padding: "50px", marginTop: 64 }}
      >
        <Route exact path="/" component={Login} />
        <Route path="/register" component={SignUp} />
        <PrivateRoute path="/categories" component={Categories} />
        <PrivateRoute path="/records" component={Record} />
        <Route path="/logout" component={Logout} />
      </Content>
    </div>
  );
}

export default AppContent;
