import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { Header } from "../components/Header";

export const Storages = () => {
    const urlStorage = 'http://127.0.0.1:8080/storages';
    const urlCategories = 'http://127.0.0.1:8080/categories';
    const urlArticles = 'http://127.0.0.1:8080/articles';
    const navigate = useNavigate();

    const [ storages, setStorages ] = useState([]);
    const [ categories, setCategories ] = useState([]);
    const [ articles, setArticles ] = useState([]);
    const [ selectedCategory, setSelectedCategory ] = useState(null);
    const [ selectedStorage, setSelectedStorage ] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);

    const [ catName, setCatName ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ artId, setArtId ] = useState(0);
    const [ artName, setArtName ] = useState("");
    const [ artDesc, setArtDesc ] = useState("");
    const [ artCant, setArtCant ] = useState("");

    const token = localStorage.getItem("token");

    if(token == null){
        navigate("/Almacen/IniciarSesion");
    }

    useEffect(() => {
        getCategories();
    }, []);
    
    const getCategories = async () => {
        const respuesta = await axios.get(urlCategories, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(respuesta.data);
    };

    const getStorages = async (id) => {
        setArticles([]);
        setSelectedCategory(id);
        const respuesta = await axios.get(urlStorage, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setStorages(respuesta.data.filter(st => st.categoryId == id));
    };

    const getArticles = async (id) => {
        setSelectedStorage(id);
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
        } else {
            let parametros = {
                location: location,
                categoryId: selectedCategory
            }
            console.log(parametros);

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
            console.log(parametros);

            if(isUpdate){
                metodo = "PUT";
                url += '/'+artId;
            }
            console.log(url)

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
            console.log(respuesta)
            switch(type){
                case 1:
                    getCategories();
                    setCatName(""); 
                    document.getElementById("categories").querySelector(".btn-close").click();
                    alert("Categoría registrada con éxito");
                    break;
                case 2:
                    getStorages(selectedCategory);
                    setLocation(""); 
                    document.getElementById("storages").querySelector(".btn-close").click();
                    alert("Almacén registrado con éxito");                    
                    break;
                case 3:
                    getArticles(selectedStorage);
                    setArtId(0);
                    setIsUpdate(false);
                    setArtDesc(""); 
                    setArtName("");
                    document.getElementById("articles").querySelector(".btn-close").click();
                    alert("Artículo registrado con éxito");                    
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
        <div className="container-fluid">
            <Header />
            <div className="row" style={{ margin: 0 }}>
                <div className="col-lg-7 col-md-8 col-12 offset-lg-2 offset-md-3" style={{ paddingTop: '20px' }}>
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="d-lg-flex justify-content-between align-items-center">
                                <span className="h4">Seleccionar Categoría</span>
                            </div>
                        </div>
                        <div className="card p-3">
                            <div className="card-body">
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-success mb-2" data-bs-toggle="modal" data-bs-target="#categories">Añadir categoría</button>
                                </div>
                                {categories.map(cat => (
                                    <div className="form-check" key={cat.id}>
                                        <input type="radio" id={`cat_${cat.id}`} name="category" 
                                            value={cat.id} className="form-check-input" 
                                            onChange={() => getStorages(cat.id)} 
                                            checked={selectedCategory === cat.id} />
                                        <label className="form-check-label" htmlFor={`cat_${cat.id}`}>{cat.name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {storages.length > 0 || selectedCategory ? (
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="d-lg-flex justify-content-between align-items-center">
                                    <span className="h4">Seleccionar Almacén</span>
                                </div>
                            </div>
                            <div className="card p-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-end">
                                        <button button className="btn btn-success mb-2" data-bs-toggle="modal" data-bs-target="#storages">Añadir almacén</button>
                                    </div>
                                    {storages.map(st => (
                                        <div className="form-check" key={st.id}>
                                            <input type="radio" id={`st_${st.id}`} name="storage" 
                                                value={st.id} className="form-check-input" 
                                                onChange={() => getArticles(st.id)} 
                                                checked={selectedStorage === st.id} />
                                            <label className="form-check-label" htmlFor={`st_${st.id}`}>{st.location}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ): (<></>)}

                    
                    {selectedStorage ? (
                        <div className="d-flex justify-content-end">
                            <button button className="btn btn-success mb-2" data-bs-toggle="modal" data-bs-target="#articles" onClick={() => openAddModal()}>Añadir artículo</button>
                        </div>
                    ) : (<></>)}
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Cantidad</th>
                                <th>Acciones</th>
                                {/*<th>Categoría</th>*/}
                            </tr>
                        </thead>
                        <tbody>
                            {articles.length > 0 ? (
                                articles.map(at => (
                                    <tr key={at.id}>
                                        <td>{at.id}</td>
                                        <td>{at.title}</td>
                                        <td>{at.description}</td>
                                        <td>{at.cantidad}</td>
                                        <td><button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#articles" onClick={() => openUpdateModal(at)}>Editar</button></td>
                                        {/*<td>{at.categoryId}</td>*/}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>Selecciona una categoría y un almacén</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
                        <button type="button" className="btn btn-primary" onClick={() => validarArt()}>Añadir</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};