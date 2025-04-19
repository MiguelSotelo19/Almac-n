import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { Header } from "../components/Header";
import { E401 } from "./E401";
import { E403 } from "./E403";

export const Bitacora = () => {
  const [bitacora, setBitacora] = useState([]);

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if(token == null){
      return(
          <E401/>
        )
  }

  if (rol != "ADMIN") {
    return (
      <E403 />
    )
  }
  
  useEffect(() => {
    const fetchBitacora = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/bitacora", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBitacora(response.data);
        console.log("Datos de bitácora recibidos:", response.data);
      } catch (error) {
        console.error("Error al obtener la bitácora:", error);
      }
    };

    fetchBitacora();
  }, []);

  return (
    <div className="p-4" style={{ backgroundColor: 'whitesmoke', height: '100vh' }}>
      <Header />
      <h1 className="text-2xl font-bold mb-4">Bitácora de Actividades</h1>
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Operación</th>
              <th>Método</th>
            </tr>
          </thead>
          <tbody>
            {bitacora.map((item, index) => (
              <tr key={index}>
                <td>{item.usuario}</td>
                <td>{item.fechaHora.split("T")[0]}</td>
                <td>{item.fechaHora.split("T")[1]}</td>
                <td>{item.endpoint}</td>
                <td>{item.metodoHttp}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Bitacora;
