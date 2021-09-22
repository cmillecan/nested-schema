import "./App.css";
import { schemaA, schemaB } from "./components/schemas";
import NestedSchemaTable from "./components/NestedSchemaTable";
import React from "react";

function App() {
  return (
    <div>
      <NestedSchemaTable schemaA={schemaA} schemaB={schemaB} />
    </div>
  );
}

export default App;
