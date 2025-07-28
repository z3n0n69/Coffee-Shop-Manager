// Local storage access key
const LOCAL_STORAGE_KEY = "coffeeStockData";

// loads data from local or flask database
async function loadStockItems() {
  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (localData) {
    return JSON.parse(localData);
  }

  try {
    // fetch backend
    const response = await fetch("http://localhost:5000/api/stock");
    const data = await response.json();

    // saves to local storage onleh
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Failed to fetch stock items from backend:", error);
    return [];
  }
}

let stockItems = []; // main memory fetch
const stockGrid = document.getElementById('stockGrid');

// delete names onleh
const deleteModal = document.getElementById("deleteModal");
const deleteItemName = document.getElementById("deleteItemName");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
let itemToDeleteIndex = null;

// refresh stock
function renderStock() {
  stockGrid.innerHTML = '';
  stockItems.forEach((item, index) => {
    const stockLevel = item.stock;
    let stockClass = 'safe';
    if (stockLevel <= 49) stockClass = 'low';
    else if (stockLevel <= 70) stockClass = 'warning';

    const card = document.createElement('div');
    card.className = 'stock-card';
    card.innerHTML = `
        <div class="stock-info">
          <h2>${item.name}</h2>
          <div class="stock-count ${stockClass}" id="count-${index}">${item.stock}</div>
          <div class="buttons">
            <button onclick="updateStock(${index}, -1)">−</button>
            <button onclick="updateStock(${index}, 1)">+</button>
          </div>
          <button class="delete-btn" onclick="deleteItem(${index})">🗑 Delete</button>
        </div>
    `;
    stockGrid.appendChild(card);
  });
}

// value and stock + localStorage
async function updateStock(index, change) {
  stockItems[index].stock = Math.max(0, stockItems[index].stock + change);

  // save data to backend
  await fetch(`http://localhost:5000/api/stock/${stockItems[index].id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock: stockItems[index].stock })
  });

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stockItems));

  const countEl = document.getElementById(`count-${index}`);
  countEl.textContent = stockItems[index].stock;
  countEl.classList.remove('low', 'warning', 'safe');

  const newStock = stockItems[index].stock;
  if (newStock <= 49) countEl.classList.add('low');
  else if (newStock <= 70) countEl.classList.add('warning');
  else countEl.classList.add('safe');
}


// delete popup
function deleteItem(index) {
  itemToDeleteIndex = index;
  deleteItemName.textContent = `Are you sure you want to delete "${stockItems[index].name}"?`;
  deleteModal.style.display = "flex";
}

// open add modal onclick
document.getElementById("addItemBtn").onclick = () => {
  document.getElementById("addModal").style.display = "flex";
};

document.getElementById("cancelItem").onclick = () => {
  closeAddModal();
};

// reset
function closeAddModal() {
  document.getElementById("addModal").style.display = "none";
  document.getElementById("itemName").value = '';
  document.getElementById("itemStock").value = '';
}

// Save new item
document.getElementById("saveItem").onclick = async () => {
  const nameInput = document.getElementById("itemName");
  const stockInput = document.getElementById("itemStock");

  const name = nameInput.value.trim();
  const stock = parseInt(stockInput.value);

  if (!name || isNaN(stock) || stock < 0) {
    showCustomModal("Please enter valid item details.");
    return;
  }

  const newItem = {
    name: capitalize(name),
    stock: stock
  };

  // add to database
  await fetch("http://localhost:5000/api/stock", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem)
  });

  // refresh backend
  stockItems = await loadStockItems();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stockItems));
  renderStock();
  closeAddModal();
};


function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// close when clicked outside modal
window.onclick = (e) => {
  if (e.target === addModal) addModal.style.display = "none";
  if (e.target === deleteModal) deleteModal.style.display = "none";
};

// confirmation for delete
confirmDeleteBtn.onclick = async () => {
  if (itemToDeleteIndex !== null) {
    const item = stockItems[itemToDeleteIndex];

    // delete also on backend
    await fetch(`http://localhost:5000/api/stock/${item.id}`, {
      method: 'DELETE'
    });

    stockItems.splice(itemToDeleteIndex, 1);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stockItems));
    renderStock();
    itemToDeleteIndex = null;
  }
  deleteModal.style.display = "none";
};


cancelDeleteBtn.onclick = () => {
  itemToDeleteIndex = null;
  deleteModal.style.display = "none";
};

// pdf download not necessary pero I think its good
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

downloadPdfBtn.onclick = () => {
  generatePdfTable(); // dom load
  const pdfElement = document.getElementById("pdfContent");
  pdfElement.style.display = "block";

  // dom loader
  setTimeout(() => {
    html2pdf()
      .set({
        margin: 0.5,
        filename: `Stock_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      })
      .from(pdfElement)
      .save()
      .then(() => {
        pdfElement.style.display = "none";
      });
  }, 100);
};

// pdf generation
function generatePdfTable() {
  const tbody = document.getElementById("pdfTableBody");
  const timeEl = document.getElementById("generatedTime");
  tbody.innerHTML = '';

  const now = new Date();
  const formatted = now.toLocaleString();
  timeEl.textContent = `Generated on: ${formatted}`;

  stockItems.forEach(item => {
    let status = '';
    if (item.stock <= 49) status = '🔴 Low Stock';
    else if (item.stock <= 70) status = '🟠 Restock Now';
    else status = '🟢 Safe';

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.stock}</td>
      <td>${status}</td>
    `;
    tbody.appendChild(row);
  });
}

// another local or backend fetch call for proper loading onleh
loadStockItems().then(data => {
  stockItems = data;
  renderStock(); // displays backend content
});