
export const StorageSelector = ({ storages, selectedStorage, getArticles }) => {
    return storages.length > 0 || selectedStorage ? (
        <div className="card mb-4">
            <div className="card-body">
                <div className="d-lg-flex justify-content-between align-items-center">
                    <span className="h4">Seleccionar Almacén</span>
                </div>
            </div>
            <div className="card p-3">
                <div className="card-body">
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-success mb-2" data-bs-toggle="modal" data-bs-target="#storages">Añadir almacén</button>
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
    ) : null;
};
