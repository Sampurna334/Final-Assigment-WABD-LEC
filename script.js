document.addEventListener('DOMContentLoaded', function() {
    const hitungBtn = document.getElementById('hitung-btn');
    const simpanBtn = document.getElementById('simpan-btn');
    const ringkasanDiv = document.getElementById('ringkasan');
    const daftarDiv = document.getElementById('daftar-pesanan');
    const namaInput = document.getElementById('name');

    let hasilMobil = [];
    let totalHarga = 0;

    function ambilDataMobil() {
        hasilMobil = [];
        totalHarga = 0;
        document.querySelectorAll('.car-card').forEach(card => {
            const cek = card.querySelector('.checkbox');
            if (cek.checked) {
                const nama = card.querySelector('h3').innerText;
                const harga = parseInt(card.querySelector('p').innerText.replace(/[^0-9]/g, ''));
                const tanggal = card.querySelector('.date').value;
                const durasi = parseInt(card.querySelector('.duration').value);
                const subtotal = harga * durasi;
                hasilMobil.push({ nama, harga, tanggal, durasi, subtotal });
                totalHarga += subtotal;
            }
        });
    }

    function tampilkanRingkasan() {
        ambilDataMobil();
        let html = '<h3>Ringkasan Pesanan</h3>';
        if (hasilMobil.length === 0) {
            html += '<p>Belum ada mobil yang dipilih.</p>';
        } else {
            html += '<ul>';
            hasilMobil.forEach(mobil => {
                html += `<li>${mobil.nama} (${mobil.tanggal}) - Rp ${mobil.harga} x ${mobil.durasi} hari = <b>Rp ${mobil.subtotal}</b></li>`;
            });
            html += `</ul><b>Total: Rp ${totalHarga}</b>`;
        }
        ringkasanDiv.innerHTML = html;
    }

    function tampilkanDaftar() {
        let daftar = JSON.parse(localStorage.getItem('daftarPemesanan')) || [];
        let html = '<h3>Daftar Pemesanan</h3>';
        if (daftar.length === 0) {
            html += '<p>Belum ada pemesanan.</p>';
        } else {
            html += '<ul>';
            daftar.forEach((pesan, i) => {
                html += `<li>
                    <b>${pesan.nama}</b> (${pesan.waktu})<br>
                    <ul>
                        ${pesan.mobil.map(m => `<li>${m.nama} (${m.tanggal}) - Rp ${m.harga} x ${m.durasi} hari = <b>Rp ${m.subtotal}</b></li>`).join('')}
                    </ul>
                    <b>Total: Rp ${pesan.total}</b>
                    <button onclick="hapusPemesanan(${i})">Hapus</button>
                </li>`;
            });
            html += '</ul>';
        }
        daftarDiv.innerHTML = html;
    }

    hitungBtn.onclick = function() {
        if (!namaInput.value.trim()) {
            alert('Isi nama pelanggan!');
            return;
        }
        tampilkanRingkasan();
    };

    simpanBtn.onclick = function() {
        if (!namaInput.value.trim()) {
            alert('Isi nama pelanggan!');
            return;
        }
        ambilDataMobil();
        if (hasilMobil.length === 0) {
            alert('Pilih minimal satu mobil!');
            return;
        }
        let daftar = JSON.parse(localStorage.getItem('daftarPemesanan')) || [];
        daftar.push({
            nama: namaInput.value.trim(),
            waktu: new Date().toLocaleString(),
            mobil: hasilMobil,
            total: totalHarga
        });
        localStorage.setItem('daftarPemesanan', JSON.stringify(daftar));
        tampilkanDaftar();
        alert('Pemesanan disimpan!');
    };

    window.hapusPemesanan = function(idx) {
        let daftar = JSON.parse(localStorage.getItem('daftarPemesanan')) || [];
        daftar.splice(idx, 1);
        localStorage.setItem('daftarPemesanan', JSON.stringify(daftar));
        tampilkanDaftar();
    };

    tampilkanDaftar();
});