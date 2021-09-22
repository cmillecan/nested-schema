import React, { useEffect, useState } from "react";
import { FieldTree, mergeStatus } from "./FieldTree";
import "./NestedSchemaTable.css";
import { Divider } from "antd";
import { RightOutlined, DownOutlined } from "@ant-design/icons";
import Nav from "./TreeButtons";

const Table = ({ children, className = "", state = "", isChild = true }) => {
  const classNames = [];
  isChild && classNames.push("table");
  className !== "" && classNames.push(className);

  return (
    <div className={classNames.join(" ")}>
      {Object.entries(children).map(([name, node], i) => (
        <Row state={state} key={i} name={name} node={node} />
      ))}
    </div>
  );
};

const Row = ({ node, name, state }) => {
  const {
    data: { type, description, tags, status },
    isOpen: nodeIsOpen,
    children,
  } = node;
  const [isOpen, setIsOpen] = useState(nodeIsOpen);
  const hasChildren = children && Object.keys(children).length > 0;

  useEffect(() => {
    if (state === "expand") setIsOpen(true);
    if (state === "collapse") setIsOpen(false);
  }, [state]);

  let rowClass;
  switch (status) {
    case mergeStatus.REMOVE:
      rowClass = "row-remove";
      break;
    case mergeStatus.ADD:
      rowClass = "row-add";
      break;
    default:
      rowClass = "row-remain";
  }

  return (
    <>
      <div className={!isOpen ? "row-wrapper" : ""}>
        <div className={`row ${rowClass}`}>
          <div className="data name">
            {hasChildren ? (
              <div
                className="dropdown-arrow"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <DownOutlined /> : <RightOutlined />}
              </div>
            ) : (
              <DownOutlined className="invisible" />
            )}
            {name}
            <span className="data type">{type}</span>
          </div>
          {description ? (
            <div className="data description">{description}</div>
          ) : (
            <div className="empty-description" />
          )}
          {tags ? (
            <div className="data tags">{tags}</div>
          ) : (
            <div className="data" />
          )}
        </div>
      </div>
      {isOpen && hasChildren && <Table children={children} state={state} />}
    </>
  );
};

function NestedSchemaTable({ schemaA, schemaB }) {
  const [tableState, setTableState] = useState("");

  const dataTree = FieldTree.merge(schemaA, schemaB);
  return (
    <div>
      <Nav
        onExpand={() => setTableState("expand")}
        onCollapse={() => setTableState("collapse")}
      />
      <div className="styled-table">
        <div className="header">
          <div className="header-name">Field</div>
          <div className="header-description">
            <Divider className="vertical-divider" type="vertical" />
            Description
          </div>
          <div className="header-tags">
            <Divider className="vertical-divider" type="vertical" />
            Tags
          </div>
          <div>
            <Divider className="vertical-divider" type="vertical" />
          </div>
        </div>
      </div>

      <Table
        className="table-container"
        children={dataTree.root.children}
        isChild={false}
        state={tableState}
      />
    </div>
  );
}

export default NestedSchemaTable;
