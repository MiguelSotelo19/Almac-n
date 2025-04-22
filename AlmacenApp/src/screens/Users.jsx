import React, { useState, useEffect } from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Header } from "../components/Header";
import { E403 } from "./E403";
import { E401 } from "./E401";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", password: "", rol: "RESPONSABLE" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ nueva: "", confirmar: "" });

  const handleClose = () => { setShow(false); setShowUpdate(false); };
  const handleShow = () => {
    setShow(true);
    setSelectedUser(null);
    setNewUser({ username: "", password: "", rol: "RESPONSABLE" });
  };

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  if (token == null) {
    return (
      <E401 />
    )
  }

  if (rol != "ADMIN") {
    return (
      <E403 />
    )
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/auth/users/responsables", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);

      setLoading(false);
    } catch (error) {
      Swal.fire("Error", "No se podido obtener la petición", "error");
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
    const { username, email, password, rol } = newUser;

    if (!username || username.trim() === "" || !/^[A-Za-z]{2,}$/.test(username)) {
      Swal.fire("Nombre requerido", "Por favor, ingresa un nombre de usuario válido.", "warning");
      return;
    }
    if (!email || email.trim() === "" || !/^(?!.*\s)(?!.*@.*@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      Swal.fire("Correo electrónico no válido", "Por favor, ingresa un correo electrónico válido.", "warning");
      return;
    }
    else if (!password || password.trim() === "" || !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password)) {
      Swal.fire("Contraseña inválida", "Debe contener al menos 8 carácteres, una mayúscula, un número y un carácter especial.", "warning");
      return;
    }
    else if (!rol || rol === "seleccionar") {
      Swal.fire("Rol requerido", "Por favor, selecciona un rol válido.", "warning");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/auth/register", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      handleClose();
      Swal.fire("¡Usuario creado!", "El usuario se ha añadido correctamente.", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo agregar el usuario.", "error");
    }
  };

  const handleUpdateUser = async () => {
    try {
      const userToSend = { ...selectedUser };
      if (!userToSend.password || userToSend.password.trim() === "") {
        delete userToSend.password;
      }

      await axios.put(`http://localhost:8080/api/auth/users/${selectedUser.id}`, userToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      handleClose();
      setSelectedUser(null);
      Swal.fire("¡Usuario actualizado!", "El usuario se ha actualizado correctamente.", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
    }
  };

  const handleOpenPasswordModal = () => {
    setShowUpdate(false);
    setShow(false);
    setPasswordData({ nueva: "", confirmar: "" });
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({ nueva: "", confirmar: "" });
  };

  const handleChangePassword = async () => {
    const { nueva, confirmar } = passwordData;
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!nueva || !regex.test(nueva)) {
      Swal.fire("Contraseña inválida", "Debe contener al menos 8 caracteres, una mayúscula, un número y un carácter especial.", "warning");
      return;
    }

    if (nueva !== confirmar) {
      Swal.fire("Contraseñas no coinciden", "Las contraseñas deben coincidir.", "warning");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/auth/users/${selectedUser.id}/password`,
        { password: nueva },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      handleClosePasswordModal();
      Swal.fire("¡Contraseña actualizada!", "La contraseña se actualizó correctamente.", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la contraseña.", "error");
    }
  };

  const isFormValid = () => {
    const username = selectedUser ? selectedUser.username : newUser.username;
    const email = selectedUser ? selectedUser.email : newUser.email;
    const password = selectedUser ? selectedUser.password : newUser.password;
  
    const usernameValid = /^[A-Za-z]{2,}$/.test(username);
    const emailValid = /^(?!.*\s)(?!.*@.*@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    const passwordValid = showUpdate ? true : /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);
  
    return usernameValid && emailValid && passwordValid;
  };
  

  if (loading) {
    return (
      <div>
        <Header />
        Cargando usuarios...
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  return (
    <div className="p-4" style={{ background: "linear-gradient(135deg, #1e1e2f, #3c3c52)", height: '100vh', color: 'white' }}>
      <Header />
      <h1 className="text-2xl font-bold mb-4">Lista de Responsables de Almacen</h1>
      <Button className="mb-3 btn" variant="success" onClick={handleShow}>Agregar Responsable</Button>

      {/* Modal para agregar o actualizar usuarios  */}
      <Modal show={show || showUpdate} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{showUpdate ? "Actualizar Usuario" : "Agregar Usuario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label className="ms-1">Nombre de Usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                pattern="^[A-Za-z]{2,}$"
                title="Solo letras sin acentos, sin espacios, puntos ni comas."
                value={selectedUser ? selectedUser.username : newUser.username}
                onChange={handleInputChange}
                isInvalid={
                  (selectedUser ? selectedUser.username : newUser.username) &&
                  !/^[A-Za-z]{2,}$/.test(selectedUser ? selectedUser.username : newUser.username)
                }
              />
              <Form.Control.Feedback type="invalid">
                El nombre de usuario debe contener solo letras (sin espacios, acentos ni símbolos) y al menos 2 caracteres.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label className="ms-1">Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                pattern="^(?!.*\s)(?!.*@.*@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                title="Debe ser un correo electrónico válido, sin espacios ni múltiples '@'."
                value={selectedUser ? selectedUser.email : newUser.email}
                onChange={handleInputChange}
                isInvalid={
                  (selectedUser ? selectedUser.email : newUser.email) &&
                  !/^(?!.*\s)(?!.*@.*@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(selectedUser ? selectedUser.email : newUser.email)
                }
              />
              <Form.Control.Feedback type="invalid">
                Ingresa un correo válido (sin espacios ni múltiples símbolos "@").
              </Form.Control.Feedback>
            </Form.Group>
            {showUpdate ? null : (<Form.Group>
              <Form.Label className="mt-3 ms-1">Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                pattern={"^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]).{8,}$"}
                title="Debe tener al menos 8 caracteres, incluyendo una letra mayúscula, un número y un carácter especial."
                value={selectedUser ? selectedUser.password : newUser.password}
                onChange={handleInputChange}
                isInvalid={
                  (selectedUser ? selectedUser.password : newUser.password) &&
                  !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(selectedUser ? selectedUser.password : newUser.password)
                }
              />
              <Form.Control.Feedback type="invalid">
                La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un símbolo especial.
              </Form.Control.Feedback>

            </Form.Group>)}

            <Form.Group>
              <Form.Group controlId="rol">
                <Form.Label className="mt-3 ms-1">Rol</Form.Label>
                <Form.Select
                  name="rol"
                  value={selectedUser ? selectedUser.rol : newUser.rol}
                  onChange={handleInputChange}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="RESPONSABLE">RESPONSABLE</option>
                </Form.Select>
              </Form.Group>
            </Form.Group>
            {/* Input de Rol eliminado */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {show ? null : (<Button variant="light" onClick={handleOpenPasswordModal}>Cambiar Contraseña</Button>)}
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button
            variant="primary"
            onClick={() => {
              if (!isFormValid()) {
                Swal.fire({
                  icon: 'error',
                  title: 'Formulario inválido',
                  text: 'Por favor, revisa los campos marcados en rojo.',
                });
                return;
              }
              showUpdate ? handleUpdateUser() : handleAddUser();
            }}
          >
            {showUpdate ? "Actualizar Usuario" : "Agregar Usuario"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPasswordModal} onHide={handleClosePasswordModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="nueva"
                value={passwordData.nueva}
                onChange={(e) => setPasswordData({ ...passwordData, nueva: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Confirmar Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirmar"
                value={passwordData.confirmar}
                onChange={(e) => setPasswordData({ ...passwordData, confirmar: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePasswordModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleChangePassword}>Actualizar Contraseña</Button>
        </Modal.Footer>
      </Modal>


      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.rol}</td>
              <td>
                <Button variant="danger" onClick={() => deleteUser(user.id)}>Eliminar</Button>{' '}
                <Button variant="warning" onClick={() => {
                  setSelectedUser({ ...user, password: "" });
                  setShowUpdate(true);
                }}>Actualizar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;
