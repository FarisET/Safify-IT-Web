import React from "react";
import  TopNavWrapper from "../../components/TopNavWrapper"; // Admin top navigation
import  ActionTopNav  from "../../pages/ActionTeam/ActionTopNav"; // Action team top navigation
import UserTopNav  from "../../user components/UserTopNav"; // Default top navigation
import MyTickets from "../shared/MyTickets";

const MyTicketPage = () => {
  const role = localStorage.getItem("role");

  return (
    <>
      {role === "admin" && <TopNavWrapper />}
      {role === "action_team" && <ActionTopNav />}
      {role !== "admin" && role !== "action_team" && <UserTopNav />}
      <MyTickets />
    </>
  );
};

export default MyTicketPage;
