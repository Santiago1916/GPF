function updateSearch() {
    const searchType = document.getElementById('searchType').value;
    const searchTitle = document.getElementById('searchTitle');
    const searchInput = document.getElementById('searchInput');

    if (searchType === 'pdv') {
        searchTitle.textContent = 'Buscar PDV';
        searchInput.placeholder = 'Ingresa el nombre del PDV';
    } else {
        searchTitle.textContent = 'Buscar Producto';
        searchInput.placeholder = 'Ingresa el nombre del producto';
    }

    // Clear the search input and results
    searchInput.value = '';
    document.getElementById('results').innerHTML = '';
}

async function search() {
    const searchType = document.getElementById('searchType').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const url = searchType === 'pdv' 
                ? 'https://botai.smartdataautomation.com//api_backend_ai/dinamic-db/report/119/GGPFPDVs'
                : 'https://botai.smartdataautomation.com//api_backend_ai/dinamic-db/report/119/GGPFProductos';
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Token 4e15396f99ae10dd5c195d81fb6a3722c0a44a10',
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        document.getElementById('results').innerHTML = '<p>Error al buscar los datos.</p>';
        return;
    }

    const data = await response.json();
    console.log(data);

    const results = data.result || [];

    const filteredResults = results.filter(item => {
        if (searchType === 'pdv') {
            return item.PDV.toLowerCase().includes(searchInput);
        } else {
            return item.PRODUCTO.toLowerCase().includes(searchInput);
        }
    });

    let output = `<h2>Resultados de la Búsqueda (${filteredResults.length} resultados encontrados):</h2>`;
    if (filteredResults.length > 0) {
        filteredResults.forEach((result, index) => {
            output += `
                <div class="result-item">
                    <h3>Resultado ${index + 1}</h3>
                    <ul>
                        ${searchType === 'pdv' 
                            ? `<li><strong>SAP:</strong> ${result.SAP} <i class="material-icons copy-icon" onclick="copyToClipboard('${result.SAP}')">content_copy</i></li>
                               <li><strong>Región:</strong> ${result.REGION}</li>
                               <li><strong>Ciudad:</strong> ${result.CUIDAD}</li>
                               <li><strong>Canal:</strong> ${result.CANAL}</li>
                               <li><strong>Cadena:</strong> ${result.CADENA}</li>
                               <li><strong>Punto de Venta:</strong> ${result.PDV}</li>`
                            : `<li><strong>SAP:</strong> ${result.SAP} <i class="material-icons copy-icon" onclick="copyToClipboard('${result.SAP}')">content_copy</i></li>
                               <li><strong>Categoría:</strong> ${result.CATEGORIA}</li>
                               <li><strong>Subcategoría:</strong> ${result.SUBCATEGORIA}</li>
                               <li><strong>Producto:</strong> ${result.PRODUCTO}</li>`
                        }
                    </ul>
                    <hr>
                </div>
            `;
        });
    } else {
        output += `<p>No se encontraron resultados para "${searchInput}".</p>`;
    }

    document.getElementById('results').innerHTML = output;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Texto copiado al portapapeles');
    }, function(err) {
        console.error('Error al copiar el texto: ', err);
    });
}