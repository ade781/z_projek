import React from "react";
import { Route } from "react-router-dom";
import LayoutPetualang from "../layouts/LayoutPetualang";
import MisiList from "../petualang/MisiList";
import DetailMisi from "../petualang/DetailMisi";
import DashboardPetualang from "../petualang/DashboardPetualang";
import EditPetualang from "../petualang/EditPetualang";
import DashboardMisiPetualang from "../petualang/DashboardMisiPetualang";
import LeaderboardPetualang from "../petualang/LeaderboardPetualang";
import Achievements from "../petualang/Achievements";
import DailyWeeklyQuests from "../petualang/DailyWeeklyQuests";
import GuildHall from "../petualang/GuildHall";
import Inventory from "../petualang/Inventory";
import Notifications from "../petualang/Notifications";

const PetualangRoutes = () => (
  <>
    <Route
      path="/misi"
      element={
        <LayoutPetualang>
          <MisiList />
        </LayoutPetualang>
      }
    />
    <Route
      path="/detail-misi/:id"
      element={
        <LayoutPetualang>
          <DetailMisi />
        </LayoutPetualang>
      }
    />
    <Route
      path="/dashboard-petualang"
      element={
        <LayoutPetualang>
          <DashboardPetualang />
        </LayoutPetualang>
      }
    />
    <Route
      path="/edit-petualang/:id"
      element={
        <LayoutPetualang>
          <EditPetualang />
        </LayoutPetualang>
      }
    />
    <Route
      path="/dashboard-misi-petualang"
      element={
        <LayoutPetualang>
          <DashboardMisiPetualang />
        </LayoutPetualang>
      }
    />
    <Route
      path="/leaderboard-petualang"
      element={
        <LayoutPetualang>
          <LeaderboardPetualang />
        </LayoutPetualang>
      }
    />
    <Route
      path="/achievements"
      element={
        <LayoutPetualang>
          <Achievements />
        </LayoutPetualang>
      }
    />
    <Route
      path="/daily-quests"
      element={
        <LayoutPetualang>
          <DailyWeeklyQuests />
        </LayoutPetualang>
      }
    />
    <Route
      path="/guild-hall"
      element={
        <LayoutPetualang>
          <GuildHall />
        </LayoutPetualang>
      }
    />
    <Route
      path="/inventory"
      element={
        <LayoutPetualang>
          <Inventory />
        </LayoutPetualang>
      }
    />
    <Route
      path="/notifications"
      element={
        <LayoutPetualang>
          <Notifications />
        </LayoutPetualang>
      }
    />
  </>
);

export default PetualangRoutes;
