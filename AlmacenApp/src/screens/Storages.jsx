import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { Header } from "../components/Header";
import { CategorySelector } from "../components/CategorySelector";
import { StorageSelector } from "../components/StorageSelector";
import { ArticleTable } from "../components/ArticleTable";
import Swal from "sweetalert2";

import "./css/Storages.css";
import { E403 } from "./E403";
import { E401 } from "./E401";

export const Storages = () => {
    const urlStorage = 'http://127.0.0.1:8080/storages';
    const urlCategories = 'http://127.0.0.1:8080/categories';
    const urlArticles = 'http://127.0.0.1:8080/articles';
    const urlUsers = 'http://127.0.0.1:8080/api/auth/users';
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const [modalAbierto, setModalAbierto] = useState(false);

    const [ storages, setStorages ] = useState([]);
    const [ categories, setCategories ] = useState([]);
    const [ articles, setArticles ] = useState([]);
    const [ user, setUser ] = useState([]);
    const [ users, setUsers ] = useState([]);
    const [ selectedCategory, setSelectedCategory ] = useState(null);
    const [ selectedStorage, setSelectedStorage ] = useState(null);
    const [ isUpdate, setIsUpdate ] = useState(false);
    const [storageToUpdate, setStorageToUpdate] = useState(null);
    const [ catName, setCatName ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ artId, setArtId ] = useState(0);
    const [ artName, setArtName ] = useState("");
    const [ artDesc, setArtDesc ] = useState("");
    const [ artCant, setArtCant ] = useState("");
    const [ userId, setUserId] = useState(0);
    const [ stuserId, setStUserId] = useState(0);
    const [editName, setEditName] = useState("");
    const [editUserId, setEditUserId] = useState("");
    const [usuariosConAlmacen, setUsuariosConAlmacen] = useState([]);

    const token = localStorage.getItem("token");
    const userLogg = JSON.parse(localStorage.getItem("userLogg"));

    if(token == null){
        return(
            <E401/>
        )
    }

    useEffect(() => {
        if(userLogg.rol!="ADMIN"){
            getUsers();
            getStorage(userLogg.id);
        } else {
            getCategories();
            getUsers();
        }
    }, []);

    useEffect(() => {
        const modal = modalRef.current;
        const handleShow = () => setModalAbierto(true);
        const handleHide = () => setModalAbierto(false);

        if (modal) {
            modal.addEventListener("shown.bs.modal", handleShow);
            modal.addEventListener("hidden.bs.modal", handleHide);
        }

        return () => {
            if (modal) {
                modal.removeEventListener("shown.bs.modal", handleShow);
                modal.removeEventListener("hidden.bs.modal", handleHide);
            }
        };
    }, []);
    

    const getUsers = async () => {
        const respuesta = await axios.get(`${urlUsers}/responsables`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(respuesta.data);
    }

    const getCategories = async () => {
        setStStorage();
        const respuesta = await axios.get(urlCategories, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(respuesta.data);
    };

    const getStorages = async (id) => {
        setUser([]);
        setArticles([]);
        setSelectedCategory(id);
        setSelectedStorage(null);
        setStStorage();
        const respuesta = await axios.get(urlStorage, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const filtrados = respuesta.data.filter(st => st.categoryId == id);
        setStorages(filtrados);
        const userIds = filtrados.map(storage => storage.userId);
        setUsuariosConAlmacen(userIds);
    };

    const getStorage = async (id) => {
        setArticles([]);
        setSelectedStorage(null);
        const respuesta = await axios.get(urlStorage, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const storage = respuesta.data.filter(st => st.userId == id)[0];
        setSelectedCategory(storage.categoryId);
        setSelectedStorage(storage.id);
        
        if(storage) {
            const respuesta = await axios.get(urlArticles, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const usuario = users.find(us => us.id == userLogg.id);
            setUser(userLogg.username);
            setArticles(respuesta.data.filter(at => at.storageId == storage.id));
        }
    }

    const getArticles = async (id, userIdSt) => {
        console.log(selectedStorage)
        setSelectedStorage(id);

        const storageSelected = storages.find(st => st.id === id);
        if (storageSelected) {
            setEditName(storageSelected.location);
            setEditUserId(storageSelected.userId);
        }

        const usuario = users.find(us => us.id == userIdSt);
        setUser(usuario ? usuario.username : "SIN RESPONSABLE");

        const respuesta = await axios.get(urlArticles, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setArticles(respuesta.data.filter(at => at.storageId == id));
    };

    const validarCat = () => {
        if(catName == "") {
            Swal.fire("Nombre vacío", "Ingresa un nombre válido.", "warning");
            return;
        } else {
            let parametros = {
                name: catName
            }

            enviarPeticion("POST", parametros, urlCategories, 1);
        }
    }

    const validarSt = () => {
        if(location == "") {
            Swal.fire("Localización inválida", "Ingresa una localización válido.", "warning");
            return;
        } if(userId == "") {
            Swal.fire("Sin usuario seleccionado", "Seleccione un usuario.", "warning");
            return;
        } else {
            let parametros = {
                location: location,
                categoryId: selectedCategory,
                userId: userId
            }

            enviarPeticion("POST", parametros, urlStorage, 2);
        }
    }

    const validarArt = () => {
        let metodo = "POST";
        let url = urlArticles;

        if(artName == "") {
            Swal.fire("Nombre vacío", "Ingresa un nombre válido.", "warning");
            return;
        } else if(artDesc == "") {
            Swal.fire("Descripción vacía", "Ingresa una descripción válida.", "warning");
            return;
        } else {
            let parametros = {
                title: artName,
                description: artDesc,
                cantidad: parseInt(artCant),
                categoryId: selectedCategory,
                storageId: selectedStorage
            }

            if(isUpdate){
                metodo = "PUT";
                url += '/'+artId;
            }
            console.log(metodo)
            console.log(parametros)

            enviarPeticion(metodo, parametros, url, 3);
        }
    }

    const enviarPeticion = async (metodo, parametros, url, type) =>{
        await axios({
            method: metodo,
            url: url,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: parametros
        }).then(function (respuesta) {
            switch(type){
                case 1:
                    getCategories();
                    setCatName(""); 
                    document.getElementById("categories").querySelector(".btn-close").click();
                    Swal.fire({
                        title:'Categoria registrada',
                        text: 'La categoria fue agregada con éxito',
                        icon:'success'
                    })
                    break;
                case 2:
                    getStorages(selectedCategory);
                    setLocation(""); 
                    document.getElementById("storages").querySelector(".btn-close").click();
                    Swal.fire({
                        title:'Almacén registrada',
                        text: 'El nuevo almacén fue agregado con éxito',
                        icon:'success'
                    })                    
                    break;
                case 3:
                    getArticles(selectedStorage, stuserId);
                    setArtId(0);
                    setIsUpdate(false);
                    setArtDesc(""); 
                    setArtName("");
                    document.getElementById("articles").querySelector(".btn-close").click();
                    Swal.fire({
                        title: isUpdate ? 'Articulo actualizado': 'Articulo registrado',
                        text: isUpdate ? 'El articulo fue actualizado con éxito': 'El articulo fue agregado con éxito',
                        icon:'success'
                    })
                    break;
            }
        })
        .catch((err) => {
            console.error("Error en la petición: ",err)
        })
    }

    const openUpdateModal = (articulo) => {
        setIsUpdate(true);
        setArtId(articulo.id);
        setArtName(articulo.title);
        setArtDesc(articulo.description);
        setArtCant(articulo.cantidad);
    };
    
    const openAddModal = () => {
        setIsUpdate(false);
        setArtName("");
        setArtDesc("");
        setArtCant(0);
    };

    
    useEffect(() => {
        if(modalAbierto){
            setLocation("");
            setUserId("");
        }
    }, [modalAbierto]);

    const handleUpdateStorage = async () => {
        if (!selectedStorage) return;
    
        try {
            await updateStorage(selectedStorage, {
                location: editName,
                userId: editUserId
            });
    
            Swal.fire("Actualizado", "El almacén fue actualizado correctamente", "success");
    
            getStorages(); // refrescar lista de almacenes
        } catch (error) {
            Swal.fire("Error", "No se pudo actualizar el almacén", "error");
            console.error(error);
        }
    };
    const updateStorage = async (id, data) => {
        return await axios.put(`${urlStorage}/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    };

    const [ stStorage, setStStorage ] = useState();

    const getInfoStorage = async (stSelectedId, stResponsableId) => {
        setSelectedStorage(stSelectedId);
    
        let storageSt = storages.find(st => st.id == stSelectedId);
        setEditName(storageSt.location);
        setEditUserId(storageSt.userId);
    
        const user = users.find(us => us.id == storageSt.userId);
    
        if (user) {
            // Creamos una copia nueva del objeto, con el campo userId renombrado
            const newStorage = {
                ...storageSt,
                userId: user.username
            };
            console.log("Modificado:", newStorage);
            setStStorage(newStorage);
        } else {
            console.warn("Usuario no encontrado");
        }
    };
    

    return (
        <div className="container-fluid p-4" style={{  background: "linear-gradient(135deg, #1e1e2f, #3c3c52)", minHeight: '100vh' }}>
            <Header />
            <div className="row" style={{ margin: 0 }}>
                <div className="col-lg-7 col-md-8 col-12 offset-lg-2 offset-md-3" style={{ paddingTop: '20px' }}>
                {userLogg.rol != "ADMIN" ? (
                    <ArticleTable articles={articles} selectedStorage={selectedStorage} openAddModal={openAddModal} openUpdateModal={openUpdateModal} responsable={user} />
                ) :(
                    <>
                        <CategorySelector categories={categories} selectedCategory={selectedCategory} getStorages={getStorages} />
                        <StorageSelector storages={storages} selectedStorage={selectedCategory} getArticles={getInfoStorage} getUsers={getUsers} setStUserId={setStUserId} />
                        {stStorage ? (
                           <div className="card mt-3 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Información del almacén</h5>
                            
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-warning mb-2" data-bs-toggle="modal" data-bs-target="#editStorageModal">Editar almacén</button>
                                    </div>
                            
                                    <p className="card-text mt-2">
                                        <strong>Nombre del almacén:</strong> {stStorage.location}<br />
                                        <strong>Nombre del responsable:</strong> {stStorage.userId}
                                    </p>
                                </div>
                            </div>                       
                        ) : (
                            <div className="alert alert-light text-center mt-3" role="alert">
                                No hay almacén seleccionado
                            </div>
                        )}

                    </>
                    )}                
                </div>
            </div>

            <div className="modal fade" id="categories" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Añadir Categoría</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="nombreCat" className="form-label">Nombre:</label>
                                <input type="text" className="form-control" id="nombreCat" placeholder="Nombre de la categoría" onInput={(e) => setCatName(e.target.value)} />
                            </div>  
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={() => validarCat()}>Añadir</button>
                    </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" ref={modalRef} id="storages" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Añadir Almacén</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="locationSt" className="form-label">Localización:</label>
                                <input type="text" className="form-control" id="locationSt" placeholder="Localización del almacén" value={location} onInput={(e) => setLocation(e.target.value)} />
                            </div>  
                            <div className="mb-3">
                                <label htmlFor="userSelect" className="form-label">Seleccionar un responsable de almacén:</label>
                                <select className="form-select" value={userId} id="userSelect" onChange={(e) => setUserId(e.target.value)}>
                                    <option id="default" value="">-- Selecciona un usuario --</option>
                                    {users
                                    .filter((user) => !usuariosConAlmacen.includes(user.id))
                                    .map((user) => (
                                        <option key={user.id} value={user.id}>
                                        {user.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={() => validarSt()}>Añadir</button>
                    </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="articles" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">{isUpdate ? "Actualizar Artículo" : "Añadir Artículo"}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="nombreCat" className="form-label">Nombre:</label>
                                <input type="text" className="form-control" id="nombreCat" placeholder="Nombre del artículo" value={artName} onInput={(e) => setArtName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="nombreCat" className="form-label">Descripción:</label>
                                <input type="text" className="form-control" id="nombreCat" placeholder="Descripción del artículo" value={artDesc} onInput={(e) => setArtDesc(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="nombreCat" className="form-label">Cantidad:</label>
                                <input type="number" className="form-control" id="nombreCat" placeholder="Cantidad de artículos" value={artCant} onInput={(e) => setArtCant(e.target.value)} />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={() => validarArt()}>{isUpdate ? "Actualizar" : "Añadir"}</button>
                    </div>
                    </div>
                </div>
            </div>

            {selectedStorage && (
                <div className="modal fade" id="editStorageModal" tabIndex="-1" aria-labelledby="editStorageModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="editStorageModalLabel">Editar Almacén</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <label className="fs-5">Nombre:</label>
                                <input type="text" className="form-control mb-2 fs-5" value={editName} placeholder="Nombre del almacén" onChange={(e) => setEditName(e.target.value)} />
                                <label className="fs-5 mt-4">Responsable:</label>
                                <select className="form-select mb-2 fs-5" value={editUserId} onChange={(e) => setEditUserId(e.target.value)}>
                                    <option value="">Seleccione un usuario</option>
                                    {users
                                        .filter(
                                        (user) =>
                                            !usuariosConAlmacen.includes(user.id) ||
                                            user.id === editUserId
                                        )
                                        .map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.username}
                                        </option>
                                        ))}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" className="btn btn-primary" onClick={() => {
                                    handleUpdateStorage();
                                    const modalElement = document.getElementById("editStorageModal");
                                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                                    modalInstance.hide();
                                }}> Actualizar </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            

        </div>
    );
};