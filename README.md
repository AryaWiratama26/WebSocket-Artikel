# **Masa Depan Komunikasi Real-Time di Web: Penerapan WebSocket untuk Pemantauan Sensor Suhu**

## Pendahuluan

Di tengah perkembangan dunia digital saat ini, kebutuhan akan komunikasi data secara langsung (real-time) antara perangkat dan pengguna menjadi semakin krusial, terutama dalam sektor Internet of Things (IoT), industri, dan sistem rumah pintar. Sistem-sistem tersebut memerlukan aliran data yang cepat dan responsif agar proses pengambilan keputusan tidak terhambat.

Namun, protokol HTTP yang bersifat stateless tidak ideal untuk komunikasi dua arah yang berkelanjutan. Untuk menjawab tantangan ini, WebSocket hadir sebagai solusi dengan menyediakan koneksi yang terus-menerus terbuka antara klien dan server, memungkinkan pertukaran data secara dua arah dan real-time.
Tulisan ini mengulas implementasi WebSocket melalui eksperimen pemantauan suhu secara langsung, serta membandingkan kinerjanya dengan metode tradisional seperti HTTP polling.

## Pembahasan Utama

## Mengapa WebSocket

WebSocket merupakan protokol komunikasi berbasis TCP yang dirancang untuk memungkinkan hubungan dua arah yang bersifat persistensi antara server dan klien. Setelah melalui proses handshake awal menggunakan HTTP, koneksi WebSocket akan tetap terbuka, sehingga data dapat dikirim dan diterima tanpa harus membuka koneksi baru setiap saat.

Kasus Penggunaan Relevan WebSocket
WebSocket sering digunakan dalam berbagai aplikasi interaktif, antara lain:
•	Pemantauan data secara langsung, seperti suhu dan kelembaban
•	Sistem notifikasi instan (misalnya peringatan stok habis atau email masuk)
•	Aplikasi kolaboratif dan game daring
•	Dashboard monitoring sistem seperti server atau pergerakan saham

## Studi Kasus: Monitoring Sensor Suhu Secara Langsung

Sebagai bentuk implementasi, penulis membuat sebuah dashboard sederhana yang menampilkan data suhu setiap detik. Data ini dihasilkan secara acak oleh server dan dikirimkan ke klien menggunakan protokol WebSocket.

1. Server (menggunakan Node.js dan library ws)
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

function getRandomTemperature() {
  return (20 + Math.random() * 10).toFixed(2);
}

wss.on('connection', function connection(ws) {
  console.log('Client terhubung');

  const interval = setInterval(() => {
    const data = JSON.stringify({
      suhu: getRandomTemperature(),
      waktu: new Date().toLocaleTimeString()
    });
    ws.send(data);
  }, 1000);

  ws.on('close', () => clearInterval(interval));
});

```
2. Client (HTML + JavaScript)
```javascript
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Suhu Real-Time</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>Monitoring Suhu Real-Time</h1>
    </header>
    <main>
      <div class="log-container">
        <ul id="log"></ul>
      </div>
    </main>
  </div>

  <script>
    const ws = new WebSocket('ws://localhost:8080');
    const log = document.getElementById("log");

    ws.onmessage = function(event) {
      const data = JSON.parse(event.data);
      const li = document.createElement("li");
      li.textContent = `Suhu: ${data.suhu} °C | Waktu: ${data.waktu}`;
      log.appendChild(li);
    };
  </script>
</body>
</html>
```
3. Langkah Uji Coba
•	Jalankan server dengan perintah: node server.js
•	Buka file index.html melalui satu atau beberapa tab browser
•	Perhatikan bahwa data suhu diperbarui tiap detik secara otomatis

Eksperimen ini juga dilakukan dengan metode polling HTTP (misalnya menggunakan setInterval(fetch)), untuk kemudian dibandingkan dengan WebSocket dalam hal efisiensi, latensi, dan jumlah koneksi yang dibuka.

## Analisis:
•	WebSocket mampu menekan latensi secara drastis dibanding metode polling biasa.
•	Penggunaan bandwidth menjadi lebih efisien karena tidak memuat header HTTP setiap kali terjadi komunikasi.
•	Sangat cocok untuk aplikasi yang memerlukan update data secara instan dan bersamaan ke banyak pengguna.
•	Namun, pada implementasi skala besar, dibutuhkan perhatian khusus pada manajemen koneksi dan strategi skalabilitas seperti load balancing.

## Kesimpulan

Eksperimen ini menunjukkan bahwa WebSocket merupakan solusi unggul dalam menyediakan komunikasi data secara real-time yang cepat dan efisien. Hanya dengan satu koneksi yang terus terbuka, server dapat mengirim data dinamis ke banyak klien secara simultan tanpa beban overhead besar seperti yang ditemukan pada metode polling.
Dengan kemampuannya, WebSocket sangat layak digunakan dalam berbagai aplikasi modern yang memerlukan sinkronisasi data secara langsung, seperti sistem IoT, dashboard pemantauan, hingga aplikasi dengan tingkat kritikal yang tinggi.

## Referensi
1.	Mozilla Developer Network (MDN). WebSocket API
2.	WebSocket.org. Introduction to WebSockets
3.	Node.js Documentation. WS — Simple to use WebSocket library
4.	Fette, I., Melnikov, A. “The WebSocket Protocol” (RFC 6455)
5.	Real-Time Web Technologies: A Comparative Review (TechRadar, 2023)

