import React from "react";
import WelcomeSearch from "../../components/Procedures/WelcomeSearch/WelcomeSearch";
import ListProcedure from "../../components/Procedures/ListProcedures/ListProcedure";
import "./ProcedureUser.scss";
const ProcedureUser = () => {
  return (
    <>
      <div className="decoration-squares">
        <div className="square-blue"></div>
        <div className="square-blue1"></div>
      </div>
      <WelcomeSearch />

      <ListProcedure />
    </>
  );
};

export default ProcedureUser;
