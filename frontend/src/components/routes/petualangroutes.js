import React from "react";
import { Route } from "react-router-dom";
import LayoutPetualang from "../layouts/LayoutPetualang";
import MisiList from "../petualang/MisiList";
import DetailMisi from "../petualang/DetailMisi";
import DashboardPetualang from "../petualang/DashboardPetualang";
import EditPetualang from "../petualang/EditPetualang";
import DashboardMisiPetualang from "../petualang/DashboardMisiPetualang";
import LeaderboardPetualang from "../petualang/LeaderboardPetualang";

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
  </>
);

export default PetualangRoutes;
