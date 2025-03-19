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

    const [ catName, setCatName ] = useState("");
    const [ location, setLocation ] = useState("");

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
                category_id: selectedCategory
            }

            enviarPeticion("POST", parametros, urlStorage, 2);
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
                    alert("Categoría registrada con éxito");
                    break;
                case 2:
                    getStorages(selectedCategory);
                    setLocation(""); 
                    document.getElementById("storages").querySelector(".btn-close").click();
                    alert("Almacén registrado con éxito");                    
                    break;
            }
        })
    }


    const token = localStorage.getItem("token");
    if (!token) navigate("/Almacen/IniciarSesion");

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
                                    <button className="btn btn-success mb-2" data-bs-toggle="modal" data-bs-target="#categories">Añadir</button>
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
                    
                    {storages.length > 0 && (
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="d-lg-flex justify-content-between align-items-center">
                                    <span className="h4">Seleccionar Almacén</span>
                                </div>
                            </div>
                            <div className="card p-3">
                                <div className="card-body">
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-success mb-2">Añadir</button>
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
                    )}

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Categoría</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.length > 0 ? (
                                articles.map(at => (
                                    <tr key={at.id}>
                                        <td>{at.id}</td>
                                        <td>{at.title}</td>
                                        <td>{at.description}</td>
                                        <td>{at.categoryId}</td>
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
                                <input type="text" className="form-control" id="nombreCat" placeholder="e.j Tecnología" onInput={(e) => setCatName(e.target.value)} />
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
                                <input type="text" className="form-control" id="locationSt" placeholder="e.j Tecnología" onInput={(e) => setLocation(e.target.value)} />
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
        </div>
    );
};