import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { Header } from "../components/Header";
import Swal from "sweetalert2";
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
      } catch (error) {
        console.error("Error al obtener la bitácora:", error);
      }
    };

    fetchBitacora();
  }, []);
  const handleLimpiarBitacora = async () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esto eliminará todos los registros de la bitácora!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("http://localhost:8080/api/bitacora", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setBitacora([]);
          Swal.fire("¡Eliminado!", "La bitácora fue limpiada.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar la bitácora.", "error");
        }
      }
    });
  };

  return (
    <div className="p-4" style={{  background: "linear-gradient(135deg, #1e1e2f, #3c3c52)", color:"white", height: '100vh' }}>
      <Header />
      <h1 className="text-2xl font-bold mb-4">Bitácora de Actividades</h1>
      <button className="btn btn-danger mb-3" onClick={handleLimpiarBitacora}>
        Limpiar Bitácora
      </button>
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
