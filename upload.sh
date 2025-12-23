#!/bin/bash

# --- SCRIPT OTOMATIS UPLOAD GITHUB SESA COFFEE ---

echo "------------------------------------------"
echo "   SESA COFFEE - GITHUB DEPLOYMENT      "
echo "------------------------------------------"

# 1. Inisialisasi Git jika belum ada
if [ ! -d ".git" ]; then
    echo "[1/5] Inisialisasi Repository Git..."
    git init
else
    echo "[1/5] Repository sudah terinisialisasi."
fi

# 2. Menambah semua file
echo "[2/5] Menambahkan file ke staging area..."
git add .

# 3. Commit
echo -n "Masukkan pesan update (default: 'Update Sesa Coffee'): "
read message
if [ -z "$message" ]; then
    message="Update Sesa Coffee System"
fi
git commit -m "$message"

# 4. Pengaturan Branch
echo "[4/5] Mengatur branch utama ke main..."
git branch -M main

# 5. Push ke GitHub
echo -n "Masukkan URL Repository GitHub Anda (contoh: https://github.com/user/sesa-coffee.git): "
read repo_url

# Cek apakah remote origin sudah ada
if git remote | grep -q 'origin'; then
    git remote set-url origin $repo_url
else
    git remote add origin $repo_url
fi

echo "[5/5] Sedang mengupload file ke GitHub..."
git push -u origin main

echo "------------------------------------------"
echo "✅ BERHASIL! Website Anda sedang diproses oleh GitHub Pages."
echo "Tunggu 1-2 menit lalu cek di tab Settings > Pages."
echo "------------------------------------------"