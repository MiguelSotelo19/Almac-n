
export const CategorySelector = ({ categories, selectedCategory, getStorages }) => {
    return (
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
    );
};
