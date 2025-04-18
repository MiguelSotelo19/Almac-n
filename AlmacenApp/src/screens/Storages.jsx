import { useState, useEffect } from "react";
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

    const [ storages, setStorages ] = useState([]);
    const [ categories, setCategories ] = useState([]);
    const [ articles, setArticles ] = useState([]);
    const [ user, setUser ] = useState([]);
    const [ users, setUsers ] = useState([]);
    const [ selectedCategory, setSelectedCategory ] = useState(null);
    const [ selectedStorage, setSelectedStorage ] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);

    const [ catName, setCatName ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ artId, setArtId ] = useState(0);
    const [ artName, setArtName ] = useState("");
    const [ artDesc, setArtDesc ] = useState("");
    const [ artCant, setArtCant ] = useState("");
    const [ userId, setUserId] = useState(0);

    const token = localStorage.getItem("token");

    if(token == null){
        return(
            <E401/>
        )
    }

    useEffect(() => {
        getCategories();
        getUsers();
    }, []);
    
    const getUsers = async () => {
        const respuesta = await axios.get(urlUsers, {
            headers: { Authorization: `Bearer ${token}` }
        });
        //console.log(respuesta.data)
        setUsers(respuesta.data);
    }

    const getCategories = async () => {
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
        //console.log("getStorages: ",token)
        const respuesta = await axios.get(urlStorage, {
            headers: { Authorization: `Bearer ${token}` }
        });
        //console.log("getStorages: ",respuesta)
        setStorages(respuesta.data.filter(st => st.categoryId == id));
    };

    const getArticles = async (id, userIdSt) => {
        setSelectedStorage(id);
        setUser(users.find(us => us.id == userIdSt).username);
        const respuesta = await axios.get(urlArticles, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setArticles(respuesta.data.filter(at => at.storageId == id));
    };

    const validarCat = () => {
        if(catName == "") {
            alert("Ingresa un nombre válido");
        } else {
            let parametros = {
                name: catName
            }

            enviarPeticion("POST", parametros, urlCategories, 1);
        }
    }

    const validarSt = () => {
        if(location == "") {
            alert("Ingresa una localización válida");
        } if(userId == "") {
            alert("Selecciona un usuario");
        } else {
            let parametros = {
                location: location,
                categoryId: selectedCategory,
                userId: userId
            }
            //console.log(parametros);

            enviarPeticion("POST", parametros, urlStorage, 2);
        }
    }

    const validarArt = () => {
        let metodo = "POST";
        let url = urlArticles;

        if(artName == "") {
            alert("Ingresa un nombre válido");
        } else if(artDesc == "") {
            alert("Ingresa una descripción válida");
        } else {
            let parametros = {
                title: artName,
                description: artDesc,
                cantidad: parseInt(artCant),
                categoryId: selectedCategory,
                storageId: selectedStorage
            }
            //console.log(parametros);

            if(isUpdate){
                metodo = "PUT";
                url += '/'+artId;
            }
            //console.log(url)

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
            //console.log(respuesta)
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
                    getArticles(selectedStorage);
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

    return (
        <div className="container-fluid" style={{ backgroundColor: 'whitesmoke', height: '100vh' }}>
            <Header />
            <div className="row" style={{ margin: 0 }}>
                <div className="col-lg-7 col-md-8 col-12 offset-lg-2 offset-md-3" style={{ paddingTop: '20px' }}>
                <CategorySelector categories={categories} selectedCategory={selectedCategory} getStorages={getStorages} />
                <StorageSelector storages={storages} selectedStorage={selectedCategory} getArticles={getArticles} getUsers={getUsers} />
                <ArticleTable articles={articles} selectedStorage={selectedStorage} openAddModal={openAddModal} openUpdateModal={openUpdateModal} responsable={user} />
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

            <div className="modal fade" id="storages" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
                                <input type="text" className="form-control" id="locationSt" placeholder="Localización del almacén" onInput={(e) => setLocation(e.target.value)} />
                            </div>  
                            <div className="mb-3">
                                <label htmlFor="userSelect" className="form-label">Seleccionar un responsable de almacén:</label>
                                <select className="form-select" id="userSelect" onChange={(e) => setUserId(e.target.value)}>
                                    <option value="">-- Selecciona un usuario --</option>
                                    {users.map((user) => (
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
        </div>
    );
};