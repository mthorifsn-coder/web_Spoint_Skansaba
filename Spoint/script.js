/**
 * SPoin – Skansaba Pos Integrated SMKN 1 Bantul
 * JavaScript Vanilla – Update Multi-step Modal Pembayaran
 */

document.addEventListener('DOMContentLoaded', function () {

    // --- FITUR GANTI BAHASA ---
    const langToggle = document.getElementById('langToggle');
    let currentLang = 'id'; // Bahasa default

    if (langToggle) {
        langToggle.addEventListener('click', function () {
            // 1. Ubah state bahasa (id -> en, atau en -> id)
            currentLang = currentLang === 'id' ? 'en' : 'id';
            
            // 2. Ubah teks di tombolnya sendiri
            this.innerText = currentLang === 'id' ? 'EN' : 'ID';
            
            // 3. Cari SEMUA elemen yang punya atribut terjemahan
            const translatableElements = document.querySelectorAll('[data-en][data-id]');
            
            // 4. Ganti isi teksnya sesuai bahasa yang aktif
            translatableElements.forEach(el => {
                el.innerHTML = el.getAttribute(`data-${currentLang}`);
            });
        });
    }

    // --- 1. NAVBAR & SMOOTH SCROLLING ---
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const hamBtn = document.getElementById('hamBtn');
    const navMenu = document.querySelector('.nav-menu');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const offset = 80; 
                const position = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });

                if (hamBtn && hamBtn.classList.contains('active')) {
                    hamBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;
        if (scrollY > 10) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        if (backToTop) {
            if (scrollY > 400) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        }
    });

    if (hamBtn && navMenu) {
        hamBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !hamBtn.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamBtn.classList.remove('active');
                }
            }
        });
    }

    // --- 2. TAB TRANSAKSI ---
    const tabs = document.querySelectorAll('.transaksi-tab');
    const panels = document.querySelectorAll('.transaksi-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const target = this.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const targetPanel = document.getElementById(`panel-${target}`);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    // --- 3. LOGIKA MULTI-STEP MODAL PEMBAYARAN ---
    const paymentModal = document.getElementById('paymentModal');
    const closeModalBtn = document.getElementById('closeModal');
    const orderSummary = document.getElementById('orderSummary');
    
    // Elemen Step Modal
    const modalTitle = document.getElementById('modalTitle');
    const stepSelection = document.getElementById('stepSelection');
    const stepAction = document.getElementById('stepAction');
    const paymentInstruction = document.getElementById('paymentInstruction');
    
    // Elemen Tombol Modal
    const btnLanjutMetode = document.getElementById('btnLanjutMetode');
    const btnKonfirmasiBayar = document.getElementById('btnKonfirmasiBayar');

    // Fungsi Buka Modal (Reset ke Step 1)
    function openPaymentModal(summaryHTML) {
        orderSummary.innerHTML = summaryHTML;
        
        // Reset Tampilan ke Step 1
        stepSelection.style.display = 'block';
        stepAction.style.display = 'none';
        btnLanjutMetode.style.display = 'flex';
        btnKonfirmasiBayar.style.display = 'none';
        modalTitle.innerText = "Selesaikan Pembayaran";
        
        paymentModal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }

    function closePaymentModal() {
        paymentModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeModalBtn.addEventListener('click', closePaymentModal);
    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) closePaymentModal();
    });

    // Validasi PPOB
    const btnBeli = document.getElementById('btnBeli');
    if (btnBeli) {
        btnBeli.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.field-error').forEach(el => el.classList.remove('show'));

            const produk = document.getElementById('produk').value;
            const nomor = document.getElementById('nomorTujuan').value.trim();
            const nominal = document.getElementById('nominal').value;

            let isValid = true;
            if (!produk) { document.getElementById('error-produk').textContent = 'Pilih layanan produk.'; document.getElementById('error-produk').classList.add('show'); isValid = false; }
            if (!nomor) { document.getElementById('error-nomor').textContent = 'Masukkan nomor tujuan.'; document.getElementById('error-nomor').classList.add('show'); isValid = false; }
            if (!nominal) { document.getElementById('error-nominal').textContent = 'Pilih nominal.'; document.getElementById('error-nominal').classList.add('show'); isValid = false; }

            if (isValid) {
                const nominalFormat = 'Rp ' + parseInt(nominal).toLocaleString('id-ID');
                const summary = `
                    <strong>🛒 Rincian Transaksi PPOB</strong>
                    Produk &nbsp;&nbsp;&nbsp;: ${produk}<br>
                    Nomor &nbsp;&nbsp;&nbsp;&nbsp;: ${nomor}<br>
                    Nominal &nbsp;: <span style="color:var(--orange); font-weight:bold;">${nominalFormat}</span>
                `;
                openPaymentModal(summary);
            }
        });
    }

    // Validasi Pemesanan Dokumen
    const btnKirimDokumen = document.getElementById('btnKirimDokumen');
    if (btnKirimDokumen) {
        btnKirimDokumen.addEventListener('click', function (e) {
            e.preventDefault();
            const nama = document.getElementById('namaDokumen').value.trim();
            const keterangan = document.getElementById('keteranganDokumen').value.trim();

            if (!nama || !keterangan) {
                alert('⚠️ Mohon lengkapi nama dan keterangan dokumen.');
                return;
            }

            const summary = `
                <strong>🖨️ Rincian Pesanan Percetakan</strong>
                Pemesan &nbsp;&nbsp;&nbsp;&nbsp;: ${nama}<br>
                Keterangan &nbsp;: ${keterangan}
            `;
            openPaymentModal(summary);
        });
    }

    // Validasi Pengiriman Paket
    const btnKirimPengiriman = document.getElementById('btnKirimPengiriman');
    if (btnKirimPengiriman) {
        btnKirimPengiriman.addEventListener('click', function (e) {
            e.preventDefault();
            const nama = document.getElementById('namaPengiriman').value.trim();
            const tujuan = document.getElementById('tujuanPengiriman').value.trim();

            if (!nama || !tujuan) {
                alert('⚠️ Mohon lengkapi nama pengirim dan alamat tujuan.');
                return;
            }

            const summary = `
                <strong>📦 Rincian Pengiriman Paket</strong>
                Pengirim &nbsp;: ${nama}<br>
                Tujuan &nbsp;&nbsp;&nbsp;&nbsp;: ${tujuan}
            `;
            openPaymentModal(summary);
        });
    }

    // --- STEP 1 -> STEP 2 (Klik Tombol Lanjut) ---
    if (btnLanjutMetode) {
        btnLanjutMetode.addEventListener('click', function() {
            const selectedMethod = document.querySelector('input[name="payment_method"]:checked').value;
            
            // Pindah Tampilan ke Step 2
            stepSelection.style.display = 'none';
            stepAction.style.display = 'block';
            btnLanjutMetode.style.display = 'none';
            btnKonfirmasiBayar.style.display = 'flex';
            modalTitle.innerText = "Instruksi Pembayaran";

            // Atur Konten Berdasarkan Metode
            if (selectedMethod === 'QRIS') {
                paymentInstruction.innerHTML = `
                    <div class="instruction-text">Silakan scan QR Code di bawah ini menggunakan aplikasi m-Banking atau E-Wallet Anda (Gopay, Dana, OVO, ShopeePay, dll).</div>
                    <div class="qr-box">
                        <!-- Menggunakan Dummy QR Code Generator dari api.qrserver.com -->
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=Pembayaran_SPoin_SMKN_1_Bantul" alt="QRIS SPoin">
                        <p style="margin-top: 16px; font-size: 1.1rem; font-weight: 700; color: var(--navy);">SPoin SMKN 1 Bantul</p>
                        <p style="font-size: 0.9rem; color: var(--gray);">NMID: ID1029384756</p>
                    </div>
                `;
            } else if (selectedMethod === 'Transfer Bank') {
                paymentInstruction.innerHTML = `
                    <div class="instruction-text">Silakan transfer sesuai nominal pesanan Anda ke salah satu rekening resmi kami di bawah ini:</div>
                    
                    <div class="bank-box">
                        <div class="bank-box-icon">BCA</div>
                        <div class="bank-box-details">
                            <p>Bank Central Asia (BCA)</p>
                            <strong>846-123-4567</strong>
                            <p>a.n. SPoin SMKN 1 Bantul</p>
                        </div>
                    </div>

                    <div class="bank-box">
                        <div class="bank-box-icon">BSI</div>
                        <div class="bank-box-details">
                            <p>Bank Syariah Indonesia (BSI)</p>
                            <strong>712-345-6789</strong>
                            <p>a.n. SPoin SMKN 1 Bantul</p>
                        </div>
                    </div>
                    
                    <div class="instruction-text" style="color: var(--orange); font-weight: 500; font-size:0.9rem;">
                        *Pastikan nama penerima adalah SPoin SMKN 1 Bantul sebelum mengonfirmasi transfer.
                    </div>
                `;
            } else if (selectedMethod === 'Tunai di Loket') {
                paymentInstruction.innerHTML = `
                    <div class="instruction-text">Anda memilih metode pembayaran Tunai / Cash.</div>
                    <div style="text-align: center; padding: 40px 16px; background: var(--off-white); border-radius: var(--radius-sm); border: 1px dashed var(--border); margin: 20px 0;">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--orange); margin-bottom: 20px;"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                        <p style="font-size: 1.1rem; color: var(--navy); font-weight: 600;">Silakan Menuju Loket SPoin</p>
                        <p style="margin-top: 12px; color: var(--gray); font-size: 0.95rem;">Tunjukkan rincian pesanan ini kepada petugas kami di loket (Gedung TEFA SMKN 1 Bantul) untuk melakukan pembayaran tunai.</p>
                    </div>
                `;
            }
        });
    }

    // --- STEP 2 Selesai (Klik Tombol Saya Sudah Bayar) ---
    if (btnKonfirmasiBayar) {
        btnKonfirmasiBayar.addEventListener('click', function() {
            // Animasi Loading
            btnKonfirmasiBayar.innerHTML = `<svg class="spin-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg> Memverifikasi...`;
            btnKonfirmasiBayar.style.opacity = '0.7';
            btnKonfirmasiBayar.style.pointerEvents = 'none';

            // Simulasi loading 1.5 detik
            setTimeout(() => {
                alert(`✅ Konfirmasi Diterima!\n\nPesanan Anda telah masuk antrean dan sedang diproses/diverifikasi oleh petugas SPoin. Terima kasih!`);
                
                // Reset semua form
                document.querySelectorAll('.form-card input, .form-card select, .form-card textarea').forEach(el => el.value = '');
                
                // Tutup & kembalikan keadaan tombol
                closePaymentModal();
                btnKonfirmasiBayar.innerHTML = 'Saya Sudah Bayar';
                btnKonfirmasiBayar.style.opacity = '1';
                btnKonfirmasiBayar.style.pointerEvents = 'auto';
            }, 1500);
        });
    }

    // --- 4. FAQ ACCORDION & SCROLL REVEAL ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function () {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) otherAnswer.classList.remove('show');
                    }
                });
                item.classList.toggle('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) answer.classList.toggle('show');
            });
        }
    });

    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('visible'));
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ============================================================
    // LOGIKA PESAN MANUAL VIA WHATSAPP (Tombol Kedua)
    // ============================================================
    
    // 1. WhatsApp PPOB
    const btnBeliWA = document.getElementById('btnBeliWA');
    if (btnBeliWA) {
        btnBeliWA.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.field-error').forEach(el => el.classList.remove('show'));

            const produk = document.getElementById('produk').value;
            const nomor = document.getElementById('nomorTujuan').value.trim();
            const nominal = document.getElementById('nominal').value;

            let isValid = true;
            if (!produk) { document.getElementById('error-produk').textContent = 'Pilih layanan produk.'; document.getElementById('error-produk').classList.add('show'); isValid = false; }
            if (!nomor) { document.getElementById('error-nomor').textContent = 'Masukkan nomor tujuan.'; document.getElementById('error-nomor').classList.add('show'); isValid = false; }
            if (!nominal) { document.getElementById('error-nominal').textContent = 'Pilih nominal.'; document.getElementById('error-nominal').classList.add('show'); isValid = false; }

            if (isValid) {
                const nominalFormat = 'Rp ' + parseInt(nominal).toLocaleString('id-ID');
                const text = `Halo Admin SPoin,\n\nSaya ingin memesan PPOB dengan rincian:\n- Layanan: ${produk}\n- Nomor: ${nomor}\n- Nominal: ${nominalFormat}\n\nMohon informasi pembayarannya. Terima kasih.`;
                window.open('https://wa.me/6285122603819?text=' + encodeURIComponent(text), '_blank');
            }
        });
    }

    // 2. WhatsApp Dokumen
    const btnKirimDokumenWA = document.getElementById('btnKirimDokumenWA');
    if (btnKirimDokumenWA) {
        btnKirimDokumenWA.addEventListener('click', function (e) {
            e.preventDefault();
            const nama = document.getElementById('namaDokumen').value.trim();
            const keterangan = document.getElementById('keteranganDokumen').value.trim();

            if (!nama || !keterangan) {
                alert('⚠️ Mohon lengkapi nama dan keterangan dokumen.');
                return;
            }

            const text = `Halo Admin SPoin,\n\nSaya ingin memesan layanan Percetakan/Dokumen:\n- Nama: ${nama}\n- Detail Pesanan: ${keterangan}\n\nMohon informasi selanjutnya. Terima kasih.`;
            window.open('https://wa.me/6285122603819?text=' + encodeURIComponent(text), '_blank');
        });
    }

    // 3. WhatsApp Pengiriman
    const btnKirimPengirimanWA = document.getElementById('btnKirimPengirimanWA');
    if (btnKirimPengirimanWA) {
        btnKirimPengirimanWA.addEventListener('click', function (e) {
            e.preventDefault();
            const nama = document.getElementById('namaPengiriman').value.trim();
            const tujuan = document.getElementById('tujuanPengiriman').value.trim();

            if (!nama || !tujuan) {
                alert('⚠️ Mohon lengkapi nama pengirim dan alamat tujuan.');
                return;
            }

            const text = `Halo Admin SPoin,\n\nSaya ingin mengirim Paket/Surat:\n- Pengirim: ${nama}\n- Alamat Tujuan: ${tujuan}\n\nMohon informasi biayanya. Terima kasih.`;
            window.open('https://wa.me/6285122603819?text=' + encodeURIComponent(text), '_blank');
        });
    }

    
});

/* Animasi Putaran Loading Tombol */
const style = document.createElement('style');
style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
document.head.appendChild(style);