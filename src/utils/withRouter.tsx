import * as React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// TODO: This is hack to allow withRouter calls in react-router v6
export default function withRouter(Component: any) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}
