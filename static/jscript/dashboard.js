const defaultStockItems = [
  { name: 'Coffee Beans', icon: 'coffee.svg', stock: 85 },
  { name: 'Milk', icon: 'milk.svg', stock: 60 },
  { name: 'Chocolate Syrup', icon: 'syrup.svg', stock: 30 },
  { name: 'Cups', icon: 'cup.svg', stock: 100 },
  { name: 'Lids', icon: 'lids.svg', stock: 95 },
  { name: 'Sugar Packets', icon: 'sugar.svg', stock: 70 },
  { name: 'Napkins', icon: 'napkins.svg', stock: 45 },
  { name: 'Straws', icon: 'straws.svg', stock: 58 },
  { name: 'Whipped Cream', icon: 'cream.svg', stock: 35 }
];

const LOCAL_STORAGE_KEY = "coffeeStockData";
let stockItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || defaultStockItems;

const stockGrid = document.getElementById('stockGrid');

// Delete modal elements
const deleteModal = document.getElementById("deleteModal");
const deleteItemName = document.getElementById("deleteItemName");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

let itemToDeleteIndex = null;


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
        <img src="assets/icons/${item.icon}" alt="${item.name}" class="stock-icon">
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

function updateStock(index, change) {
  stockItems[index].stock = Math.max(0, stockItems[index].stock + change);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stockItems));

  const countEl = document.getElementById(`count-${index}`);
  countEl.textContent = stockItems[index].stock;
  countEl.classList.remove('low', 'warning', 'safe');

  const newStock = stockItems[index].stock;
  if (newStock <= 49) countEl.classList.add('low');
  else if (newStock <= 70) countEl.classList.add('warning');
  else countEl.classList.add('safe');

}

function deleteItem(index) {
  itemToDeleteIndex = index;
  deleteItemName.textContent = `Are you sure you want to delete "${stockItems[index].name}"?`;
  deleteModal.style.display = "flex";
}



// Open/Close modal
document.getElementById("addItemBtn").onclick = () => {
  document.getElementById("addModal").style.display = "flex";
};

document.getElementById("cancelItem").onclick = () => {
  closeAddModal();
};

function closeAddModal() {
  document.getElementById("addModal").style.display = "none";
  document.getElementById("itemName").value = '';
  document.getElementById("itemStock").value = '';
  document.getElementById("itemImage").value = '';
}

// Save Item
document.getElementById("saveItem").onclick = () => {
  const nameInput = document.getElementById("itemName");
  const stockInput = document.getElementById("itemStock");
  const imageInput = document.getElementById("itemImage");

  const name = nameInput.value.trim();
  const stock = parseInt(stockInput.value);
  const file = imageInput.files[0];

  if (!name || isNaN(stock) || stock < 0 || !file || !file.type.startsWith("image/")) {
    showCustomModal("Please enter valid item details and upload an image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageData = e.target.result;

    const newItem = {
      name: capitalize(name),
      stock: stock,
      imageData: imageData
    };

    stockItems.push(newItem);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stockItems));
    renderStock();
    closeAddModal();
  };

  reader.readAsDataURL(file);
};

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

renderStock();

window.onclick = (e) => {
  if (e.target === addModal) {
    addModal.style.display = "none";
  }
};

confirmDeleteBtn.onclick = () => {
  if (itemToDeleteIndex !== null) {
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

window.onclick = (e) => {
  if (e.target === addModal) addModal.style.display = "none";
  if (e.target === deleteModal) deleteModal.style.display = "none";
};

const downloadPdfBtn = document.getElementById("downloadPdfBtn");

downloadPdfBtn.onclick = () => {
  generatePdfTable(); // Fill in the table

  const pdfElement = document.getElementById("pdfContent");

  pdfElement.style.display = "block";

  // delay for conversion
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
        // Auto hide
        pdfElement.style.display = "none";
      });
  }, 100); // Delay
};


function generatePdfTable() {
  const tbody = document.getElementById("pdfTableBody");
  const timeEl = document.getElementById("generatedTime");
  tbody.innerHTML = '';

  // Includes current date/time on pdf
  const now = new Date();
  const formatted = now.toLocaleString();
  timeEl.textContent = `Generated on: ${formatted}`;

  stockItems.forEach(item => {
    let status = '';
    if (item.stock <= 49) {
      status = '🔴 Low Stock';
    } else if (item.stock <= 70) {
      status = '🟠 Restock Now';
    } else {
      status = '🟢 Safe';
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.stock}</td>
      <td>${status}</td>
    `;
    tbody.appendChild(row);
  });
}

