import { useQuery } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { type CSSProperties, useState } from "react";
import { useTitle } from "react-use";
// Ant Design Resources
import { Button, Space } from "antd";
// Services
import { firestore } from "services/firebase";
// Internal
import { DevHeader } from "./DevHeader";

// import { Image, Layout } from 'antd';
// Resources

function Playground() {
  useTitle("Playground | Dev | Tarde Divertida");

  const styles: CSSProperties = {
    // display: 'grid',
    // gridTemplateColumns: 'repeat(5, 1fr)',

    // gap: '1rem',
    display: "flex",
    flexWrap: "wrap",
  };
  const stylesLi: CSSProperties = {
    border: "1px solid black",
    margin: "4px",
    padding: "8px",
    // width: '132px',
    // display: 'flex',
    // flexDirection: 'column',
    background: "white",
    // alignItems: 'center',
    // justifyContent: 'space-between',
  };

  const [lines, setLines] = useState<any>([]);

  return (
    <div>
      <DevHeader title="Playground" />

      <Space>{}</Space>
    </div>
  );
}

export default Playground;
