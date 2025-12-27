import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, serverTimestamp, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    databaseURL: "https://sesa-coffee-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ================= KASIR & MENU LOGIC =================

// 1. Ambil Menu dari Database untuk ditampilkan di Kasir/Order
window.loadMenu = function() {
    const menuRef = ref(db, 'menus');
    onValue(menuRef, (snapshot) => {
        const data = snapshot.val();
        const menuGrid = document.getElementById('menu-grid');
        if (!menuGrid) return;
        
        menuGrid.innerHTML = '';
        for (let id in data) {
            const item = data[id];
            menuGrid.innerHTML += `
                <div class="menu-card" onclick="addToCart('${item.name}', ${item.price})">
                    <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.name}">
                    <div class="menu-content">
                        <h3>${item.name}</h3>
                        <div class="menu-footer">
                            <span class="price">Rp ${item.price.toLocaleString()}</span>
                            <button class="btn btn-accent">+</button>
                        </div>
                    </div>
                </div>`;
        }
    });
}

// 2. Login Kasir & Buka Shift
window.loginKasir = function() {
    const name = document.getElementById('cashier-name').value;
    if(!name) return alert("Masukkan nama kasir!");
    
    const shiftId = "shift_" + Date.now();
    const shiftData = {
        cashier: name,
        startTime: new Date().toLocaleString('id-ID'),
        totalIncome: 0,
        status: "OPEN"
    };

    set(ref(db, 'shifts/' + shiftId), shiftData);
    localStorage.setItem('sesa_cashier', name);
    localStorage.setItem('sesa_shift_id', shiftId);
    window.location.href = 'kasir.html';
}

// 3. Konfirmasi Bayar di Kasir (Simpan ke Orders & Update Pendapatan Shift)
window.confirmPayment = function() {
    let cart = JSON.parse(localStorage.getItem('sesa_cart')) || [];
    if (cart.length === 0) return alert("Keranjang kosong!");
    
    const cashierName = localStorage.getItem('sesa_cashier') || "Guest";
    const shiftId = localStorage.getItem('sesa_shift_id');
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const orderData = {
        cashier: cashierName,
        items: cart,
        total: total,
        time: new Date().toLocaleString('id-ID'),
        timestamp: serverTimestamp()
    };

    const newOrderRef = push(ref(db, 'orders'));
    set(newOrderRef, orderData).then(() => {
        // Update Total di Shift Aktif
        if(shiftId) {
            const shiftRef = ref(db, 'shifts/' + shiftId);
            onValue(shiftRef, (snap) => {
                const currentShift = snap.val();
                if(currentShift && currentShift.status === "OPEN") {
                    update(shiftRef, { totalIncome: (currentShift.totalIncome || 0) + total });
                }
            }, { onlyOnce: true });
        }
        
        // Cetak Struk
        window.printReceipt(orderData);
        
        alert("Transaksi Berhasil!");
        localStorage.removeItem('sesa_cart');
        window.renderOrder();
    });
}

// 4. Fungsi Cetak Struk
window.printReceipt = function(data) {
    const printWindow = window.open('', '', 'width=300,height=600');
    let itemsHtml = data.items.map(i => `<div>${i.name} <span>${i.price.toLocaleString()}</span></div>`).join('');
    
    printWindow.document.write(`
        <style>
            body { font-family: monospace; width: 58mm; padding: 10px; }
            h2 { text-align: center; margin: 0; }
            hr { border-top: 1px dashed #000; }
            .flex { display: flex; justify-content: space-between; }
        </style>
        <h2>SESA COFFEE</h2>
        <center><small>${data.time}</small></center>
        <hr>
        ${itemsHtml}
        <hr>
        <div class="flex"><b>TOTAL</b> <b>Rp ${data.total.toLocaleString()}</b></div>
        <center><br>Terima Kasih!</center>
    `);
    printWindow.document.close();
    printWindow.print();
}

// ================= ADMIN LOGIC =================

// Admin: Tambah Menu Baru
window.addMenu = function() {
    const name = document.getElementById('m-name').value;
    const price = parseInt(document.getElementById('m-price').value);
    const img = document.getElementById('m-img').value;

    push(ref(db, 'menus'), { name, price, image: img });
    alert("Menu Berhasil Ditambah!");
}

// Admin: Pantau Shift & Pendapatan
window.loadAdminDashboard = function() {
    onValue(ref(db, 'shifts'), (snap) => {
        const shifts = snap.val();
        const list = document.getElementById('shift-reports');
        if(!list) return;
        list.innerHTML = '';
        for(let id in shifts) {
            const s = shifts[id];
            list.innerHTML += `
                <tr>
                    <td>${s.cashier}</td>
                    <td>${s.startTime}</td>
                    <td>Rp ${s.totalIncome.toLocaleString()}</td>
                    <td>${s.status}</td>
                </tr>`;
        }
    });
}

// Inisialisasi saat halaman load
window.onload = () => {
    if(document.getElementById('menu-grid')) window.loadMenu();
    if(document.getElementById('cart-list')) window.renderOrder();
    if(document.getElementById('shift-reports')) window.loadAdminDashboard();
}