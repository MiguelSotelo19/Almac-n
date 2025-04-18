import editar from "../assets/editar.png";
import borrar from "../assets/borrar.png";
import Swal from "sweetalert2";
import axios from "axios";

export const ArticleTable = ({ articles, selectedStorage, getArticles, openAddModal, openUpdateModal, responsable, stuserId }) => {
    const token = localStorage.getItem("token");
    const urlArticle = 'http://127.0.0.1:8080/articles/';

    const deleteArticle = async (idArticle, article) => {
        Swal.fire({
            icon: "warning",
            title: "¿Seguro que deseas continuar?",
            text: `Esto eliminará todos los artículos ${article}`,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        }).then(async () => {
            await axios
                .delete(`${urlArticle}${idArticle}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        accept: "application/json",
                    }
                })
                .then((response) => {
                    getArticles(selectedStorage, stuserId);
                    Swal.fire({
                        icon: "success",
                        title: "Artículo eliminado",
                        text: `El artículo se ha eliminado correctamente`,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonText: "Aceptar",
                    })
                })
                .catch((err) => {
                    console.error("Error al eliminar el artículo: ",err)
                })
        });
    }

    return (
        <>
        {selectedStorage ? (
            <div className="d-flex justify-content-end">
                <button className="btn btn-success mb-2" data-bs-toggle="modal" data-bs-target="#articles" onClick={() => openAddModal()}>Añadir artículo</button>
            </div>
        ) : (<></>)}
        <table className="table table-striped">
            <thead>
                <tr>
                    <th colSpan={5}>Responsable de almacén: {responsable}</th>
                </tr>
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
                            <td>
                                <button className="btn" data-bs-toggle="modal" data-bs-target="#articles" onClick={() => openUpdateModal(at)} data-toggle="tooltip" data-placement="top" title="Actualizar artículo"><img src={editar} alt="Actualizar" /></button>
                                <button className="btn" data-toggle="tooltip" data-placement="top" title="Eliminar artículo" onClick={() => deleteArticle(at.id, at.title)}><img src={borrar} alt="Eliminar" /></button>
                            </td>
                            {/*<td>{at.categoryId}</td>*/}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5}>Selecciona una categoría y un almacén</td>
                    </tr>
                )}
            </tbody>
        </table>
        </>
    );
};
