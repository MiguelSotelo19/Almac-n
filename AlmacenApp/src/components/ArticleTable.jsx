
export const ArticleTable = ({ articles, selectedStorage, openAddModal, openUpdateModal, responsable }) => {
    return (
        <>
        {selectedStorage ? (
            <div className="d-flex justify-content-end">
                <button button className="btn btn-success mb-2" data-bs-toggle="modal" data-bs-target="#articles" onClick={() => openAddModal()}>Añadir artículo</button>
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
                            <td><button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#articles" onClick={() => openUpdateModal(at)}>Editar</button></td>
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
