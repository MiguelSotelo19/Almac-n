import React, { useState, useEffect } from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = "tokenbearer.root.voidtoken";
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", password: "", rol: "" });
  const [selectedUser, setSelectedUser] = useState(null);

  const handleClose = () => { setShow(false); setShowUpdate(false); };
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/auth/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
        Swal.fire("¡Eliminado!", "El usuario ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      handleClose();
      Swal.fire("¡Usuario creado!", "El usuario se ha añadido correctamente.", "success");
    } catch (error) {
      console.error("Error adding user:", error);
      Swal.fire("Error", "No se pudo agregar el usuario.", "error");
    }
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`http://localhost:8080/api/auth/users/${selectedUser.id}`, selectedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      handleClose();
      Swal.fire("¡Usuario actualizado!", "El usuario se ha actualizado correctamente.", "success");
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
    }
  };

  if (loading) {
    return (
      <div>
        Cargando usuarios...
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  return (
    <div className="p-4" style={{ backgroundColor: '#3e4041', height: '100vh' }}>
      <h1 className="text-2xl font-bold mb-4">Lista de Responsables de Almacen</h1>
      <Button onClick={handleShow}>Agregar Usuario</Button>

      {/* Modal para agregar o actualizar usuarios */}
      <Modal show={show || showUpdate} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{showUpdate ? "Actualizar Usuario" : "Agregar Usuario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre de Usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={selectedUser ? selectedUser.username : newUser.username}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="text"
                name="password"
                value={selectedUser ? selectedUser.password : newUser.password}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Rol</Form.Label>
              <Form.Control
                type="text"
                name="rol"
                value={selectedUser ? selectedUser.rol : newUser.rol}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="primary" onClick={showUpdate ? handleUpdateUser : handleAddUser}>
            {showUpdate ? "Actualizar Usuario" : "Agregar Usuario"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Contraseña</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.password}</td>
              <td>{user.rol}</td>
              <td>
                <Button variant="danger" onClick={() => deleteUser(user.id)}>Eliminar</Button>{' '}
                <Button variant="warning" onClick={() => { setSelectedUser(user); setShowUpdate(true); }}>Actualizar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;
