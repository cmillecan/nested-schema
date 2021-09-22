import React from "react";
import "./TreeButtons.css";
import { Button } from "antd";

const TreeButtons = ({ onExpand, onCollapse }) => {
  return (
    <div className="navbar-container">
      <div className="nav-btn">
        <Button onClick={onExpand} type="primary" size="medium">
          Expand All
        </Button>
        <Button type="primary" size="medium" onClick={onCollapse}>
          Collapse All
        </Button>
      </div>
    </div>
  );
};

export default TreeButtons;
