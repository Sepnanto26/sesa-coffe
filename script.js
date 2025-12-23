// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Konfigurasi Database (Gunakan URL ini untuk demo, pastikan internet aktif)
const firebaseConfig = {
    databaseURL: "https://sesa-coffee-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Sinkronkan fungsi ke Window agar bisa dipanggil oleh tombol HTML (onclick)
window.addToCart = function(name, price) {
    let cart = JSON.parse(localStorage.getItem('sesa_cart')) || [];
    const item = { id: Date.now(), name, price };
    cart.push(item);
    localStorage.setItem('sesa_cart', JSON.stringify(cart));
    alert(`✓ ${name} berhasil ditambah!`);
    if(document.getElementById('cartCount')) {
        document.getElementById('cartCount').innerText = cart.length;
    }
}

window.renderOrder = function() {
    let cart = JSON.parse(localStorage.getItem('sesa_cart')) || [];
    const listElement = document.getElementById('cart-list');
    const priceElement = document.getElementById('total-price');
    if (!listElement) return;

    listElement.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        listElement.innerHTML += `
            <div class="cart-item">
                <div><strong>${item.name}</strong><br>Rp ${item.price.toLocaleString()}</div>
                <button onclick="removeItem(${index})" style="color:red; background:none; border:none; cursor:pointer;">Hapus</button>
            </div>`;
    });
    priceElement.innerText = `Rp ${total.toLocaleString()}`;
    if(document.getElementById('subtotal-val')) document.getElementById('subtotal-val').innerText = `Rp ${total.toLocaleString()}`;
}

window.removeItem = function(index) {
    let cart = JSON.parse(localStorage.getItem('sesa_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('sesa_cart', JSON.stringify(cart));
    window.renderOrder();
}

window.confirmPayment = function() {
    let cart = JSON.parse(localStorage.getItem('sesa_cart')) || [];
    if (cart.length === 0) return alert("Keranjang kosong!");
    
    const customerName = prompt("Masukkan Nama Anda untuk Pesanan:");
    if(!customerName) return alert("Nama harus diisi untuk memproses pesanan!");

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const method = document.getElementById('pay-method').value;

    const orderData = {
        customer: customerName,
        items: cart,
        total: total,
        method: method,
        time: new Date().toLocaleString('id-ID')
    };

    console.log("Sedang mengirim pesanan...", orderData);

    // KIRIM KE FIREBASE
    const ordersRef = ref(db, 'orders');
    const newOrderRef = push(ordersRef);
    
    set(newOrderRef, orderData)
        .then(() => {
            console.log("Pesanan Berhasil dikirim ke Firebase!");
            alert("Pembayaran Berhasil! Pesanan Anda sudah masuk ke sistem dapur.");
            localStorage.removeItem('sesa_cart');
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error("Firebase Error:", error);
            alert("GAGAL MENGIRIM PESANAN: " + error.message + "\n\nPastikan internet Anda aktif.");
        });
}