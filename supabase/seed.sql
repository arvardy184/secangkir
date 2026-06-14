-- Seed data: 15 warung kopi di Malang
-- owner_id dibiarkan NULL karena RLS "Public can read warung" mengizinkan SELECT untuk semua baris
-- Jalankan ini di Supabase SQL Editor setelah schema.sql

insert into warung (nama, deskripsi, vibe_tags, price_range, lat, lng, alamat, ai_bio, ai_tagline, ai_captions) values

(
  'Filosofi Kopi Malang',
  'Warung kopi minimalis di tengah kota dengan konsep slow bar. Setiap cangkir diseduh manual dengan biji pilihan dari petani lokal Jawa Timur.',
  array['tenang', 'cozy', 'specialty', 'wifi kencang'],
  'Rp30.000 - Rp50.000',
  -7.9797,
  112.6304,
  'Jl. Semeru No. 12, Oro-Oro Dowo, Klojen, Malang',
  'Filosofi Kopi Malang hadir sebagai ruang untuk memperlambat diri. Di sini, setiap proses penyeduhan adalah bentuk penghormatan pada petani yang menanam biji kopi dengan penuh kesabaran.',
  'Setiap tegukan punya cerita.',
  array[
    'Pagi ini dimulai dengan pour-over dari Gunung Ijen. Aroma buah, body ringan, aftertaste panjang. Ini bukan sekadar kopi — ini cara kami menyapa hari. ☕ #FilosofiKopiMalang #SlowBar',
    'Kalau kamu mau nugas tapi butuh suasana yang tidak bikin pusing, meja kayu di pojokan kami selalu kosong buat kamu. Wifi kencang, playlist lofi, kopi enak. 🎧 #WorkFromWarung',
    'Biji kopi kami langsung dari petani Jawa Timur. Tidak ada rantai panjang, tidak ada markup berlebihan. Yang ada hanya rasa yang jujur dan harga yang adil. 🌱 #KopiLokal',
    'Menu baru: Kopi Susu Aren dengan espresso single origin Bondowoso. Manis alami, bold, dan bikin nagih. Coba sebelum kehabisan! 🍯 #MenuBaru #KopiSusuAren',
    'Sudah tahu belum? Setiap Sabtu pagi kami ada sesi cupping gratis. Belajar mengenal rasa kopi bersama barista kami yang berpengalaman. Tempat terbatas — DM untuk reservasi! ☕ #CuppingSession'
  ]
),

(
  'Kopi Tetes Malang',
  'Warung kopi ala rumahan di gang kecil dekat kampus. Harga mahasiswa, rasa bintang lima. Tempat nongkrong favorit anak UB dan UM.',
  array['rame', 'murah', 'buat nugas', 'wifi kencang'],
  '< Rp15.000',
  -7.9528,
  112.6142,
  'Jl. MT Haryono Gang 5 No. 3, Dinoyo, Lowokwaru, Malang',
  'Kopi Tetes lahir dari keyakinan sederhana: kopi enak seharusnya bisa dinikmati semua orang, termasuk mahasiswa akhir bulan. Kami menyajikan racikan kopi yang jujur dengan harga yang tidak bikin dompet menangis.',
  'Kopi enak tidak harus mahal.',
  array[
    'Deadline besok, uang tinggal dua puluh ribu? Tenang. Di Kopi Tetes kamu bisa dapat kopi + cemilan + duduk seharian dengan wifi yang tidak putus. 📚 #KopiMahasiswa #AntiGalau',
    'Kopi susu original kami cuma Rp10.000 tapi rasanya bikin kamu balik lagi. Sudah ratusan pelanggan setia yang membuktikan. Kapan kamu nyobain? ☕ #TetesDiHati',
    'Jam 7 pagi sudah buka, jam 12 malam baru tutup. Karena kami tahu jadwal kuliah dan deadline tugas tidak pernah manusiawi. 🌙 #BukaTerus #Malang',
    'Menu favorit pelanggan bulan ini: Es Kopi Susu Gula Aren Rp12.000. Simple, manis, dingin, bikin fokus balik lagi ke laptop. ❄️ #MenuFavorit',
    'Bawa laptop, bawa buku, bawa teman — semua disambut di sini. Kursi kami cukup, colokan ada di setiap meja, dan kopi kami tidak pernah kehabisan. 💻 #KopiTetes'
  ]
),

(
  'Sawah Kopi',
  'Kafe outdoor di pinggir sawah Dau dengan view Gunung Kawi. Tempat healing tipis-tipis sambil ngopi sore.',
  array['outdoor', 'tenang', 'aesthetic', 'adem'],
  'Rp15.000 - Rp30.000',
  -7.9201,
  112.5703,
  'Jl. Raya Dau No. 88, Dau, Kab. Malang',
  'Sawah Kopi mengajak kamu keluar dari keramaian kota. Di sini, kursi rotan menghadap hamparan hijau sawah dan siluet gunung yang selalu berhasil membuat pikiran tenang.',
  'Ngopi sambil memeluk alam.',
  array[
    'Sore terbaik adalah sore yang dihabiskan di sini. Es teh, kopi susu, angin sawah, dan Gunung Kawi yang berdiri gagah di kejauhan. Tidak ada yang lebih menyembuhkan dari ini. 🌾 #SawahKopi #HealingMalang',
    'Tidak perlu jauh-jauh ke Bali untuk dapat suasana tenang. Sawah Kopi ada di Dau, 20 menit dari pusat kota Malang. Parkir luas, harga bersahabat. 🏔️ #MalangHits',
    'Menu andalan kami: Kopi Jahe Rempah yang hangat dan Es Kopi Susu Brown Sugar yang segar. Pilih sesuai cuaca kamu hari ini! ☕❄️ #MenuSawahKopi',
    'Foto favoritmu di sini pasti yang ada sawahnya. Kami sediakan spot foto terbaik dengan latar belakang alam asli, bukan backdrop palsu. 📸 #FotoEskapisMalang',
    'Weekend ini weekend healing. Ajak pasangan, teman, atau datang sendiri — semua momen terasa lebih bermakna di Sawah Kopi. 🌅 #WeekendVibes #Malang'
  ]
),

(
  'Warung Kopi Inggil',
  'Warung kopi legendaris di kawasan heritage Kayutangan. Bangunan kolonial Belanda, kopi tubruk otentik, dan menu makanan Jawa Timur yang tidak pernah mengecewakan.',
  array['tenang', 'cozy', 'aesthetic'],
  'Rp15.000 - Rp30.000',
  -7.9825,
  112.6322,
  'Jl. Basuki Rahmat No. 5, Kauman, Klojen, Malang',
  'Warung Kopi Inggil adalah penjaga memori. Di tengah deretan bangunan tua Kayutangan, warung ini telah menyajikan kopi tubruk dan makanan Jawa Timur selama puluhan tahun tanpa kehilangan jiwanya.',
  'Rasa lama yang tidak pernah tua.',
  array[
    'Kopi tubruk kami diseduh dengan cara yang sama sejak tiga dekade lalu. Ada hal-hal yang memang sebaiknya tidak berubah. 🫖 #KopiInggil #Kayutangan #Heritage',
    'Jangan lewatkan Rawon Inggil kami kalau kamu ke sini. Kuah hitam pekat, daging empuk, dan lauk lengkap — makan siang paling memuaskan di Malang. 🍲 #RawonMalang',
    'Duduk di teras kolonial kami sambil ngopi pagi adalah ritual yang tidak bisa digantikan aplikasi delivery manapun. Ada yang mau bergabung besok? ☕ #PagiMalang',
    'Kawasan Kayutangan Heritage semakin ramai, tapi Warung Kopi Inggil tetap jadi anchor yang selalu bikin pengunjung ingin kembali. Karena autentik tidak pernah ketinggalan zaman. 🏛️ #KayutanganHeritage',
    'Buat kamu yang baru pertama ke Malang: mulai pagi dengan sarapan di Inggil, jalan kaki di Kayutangan, lalu tutup hari dengan sore di Alun-alun. Itinerary sempurna tanpa biaya besar! 🗺️ #VisitMalang'
  ]
),

(
  'Kedai Kopi Raisa',
  'Kafe perempatan Soekarno-Hatta dengan konsep industrial-cozy. Favorit pekerja kantoran Malang untuk meeting santai dan kerja sore hari.',
  array['cozy', 'wifi kencang', 'buat nugas', 'adem'],
  'Rp15.000 - Rp30.000',
  -7.9662,
  112.6186,
  'Jl. Soekarno-Hatta No. 45, Mojolangu, Lowokwaru, Malang',
  'Kedai Kopi Raisa dirancang untuk mereka yang butuh ruang ketiga — bukan rumah, bukan kantor, tapi tempat di mana produktivitas dan ketenangan bisa hadir bersamaan.',
  'Ruang ketiga untuk pikiran terbaikmu.',
  array[
    'Meeting tidak selalu harus di ruang rapat yang pengap. Di Kedai Raisa, meja besar kami siap untuk diskusi tim, presentasi klien, atau sekadar brainstorming santai. AC dingin, kopi selalu ada. 💼 #MeetingKafe #Malang',
    'Kopi Andaliman kami jadi menu yang paling ditunggu pelanggan setia. Rasa rempah yang khas, aroma yang bold, dan aftertaste yang panjang. Belum coba? Rugi! ☕ #KopiAndaliman',
    'Jam 3 sore adalah waktu terbaik di Raisa. Matahari masuk dari jendela besar, playlist jazz mengalun, dan semuanya terasa jauh lebih ringan dari tadi pagi. 🎵 #AfternoonVibes',
    'Promo hari ini: Buy 2 kopi gratis 1 snack pilihan! Berlaku sampai jam 5 sore. Ajak teman ke sini sekarang 🧇☕ #PromoRaisa #KopiMalang',
    'Kami percaya kafe yang baik adalah kafe yang membuat kamu tidak sadar sudah 4 jam di sini. Dan itu yang selalu terjadi di Raisa 😄 #KopiRaisa #MalangHits'
  ]
),

(
  'Ngopi Bareng Bro',
  'Warung kopi pinggir jalan di Singosari yang tidak pernah sepi. Kopi robusta lokal, gorengan hangat, dan obrolan tidak ada habisnya.',
  array['rame', 'murah', 'outdoor'],
  '< Rp15.000',
  -7.9075,
  112.6651,
  'Jl. Raya Singosari No. 112, Singosari, Kab. Malang',
  'Ngopi Bareng Bro adalah warung kopi yang tidak punya daftar menu panjang atau dekorasi yang rumit. Yang ada hanya kopi enak, gorengan selagi panas, dan suasana yang membuat siapapun merasa seperti ketemu lama teman lama.',
  'Tempat ngobrol terbaik di Singosari.',
  array[
    'Tidak ada yang lebih enak dari kopi hitam panas dan pisang goreng saat hujan turun. Di Ngopi Bareng Bro, itu bisa kamu dapat dengan dua belas ribu perak. 🌧️☕ #NgopiBro #Singosari',
    'Langganan kami ada yang datang tiap pagi selama 10 tahun. Bukan karena tidak ada pilihan lain, tapi karena memang tidak ada yang seperti ini. Terima kasih atas kepercayaannya! ❤️ #PelangganSetia',
    'Kopi robusta Malang kami dipetik langsung dari kebun di Dampit. Bold, pahit yang enak, dan bikin melek sampai malam. Tidak ada campuran, tidak ada rekayasa rasa. 💪 #KopiRobusta #Dampit',
    'Kalau kamu mampir, jangan lupa pesan tahu isi dan bakwan jagungnya. Ini bukan sekedar gorengan — ini adalah pengalaman. 🔥 #GorenganEnak',
    'Buka jam 5 pagi sampai jam 11 malam. Karena kami tahu ngopi enak tidak punya jam. Kapanpun kamu lewat Singosari, kami ada. 🌙 #BukaTerus #NgopiBro'
  ]
),

(
  'Ruang Rasa Coffee',
  'Studio kopi merangkap galeri seni kecil di Blimbing. Setiap bulan ada pameran seniman lokal Malang dengan minuman spesial yang terinspirasi karya mereka.',
  array['aesthetic', 'tenang', 'cozy'],
  'Rp30.000 - Rp50.000',
  -7.9485,
  112.6512,
  'Jl. Ahmad Yani No. 23, Blimbing, Malang',
  'Ruang Rasa Coffee percaya bahwa kopi dan seni adalah bahasa universal yang bisa dipahami semua orang. Di sini, setiap cangkir adalah ekspresi, dan setiap tembok adalah kanvas.',
  'Di mana kopi bertemu seni.',
  array[
    'Bulan ini kami punya pameran lukisan dari seniman muda Malang, Arya Wibowo. Kunjungi sambil menikmati kopi spesial edisi terbatas yang terinspirasi dari karya-karyanya. 🎨☕ #RuangRasa #SeniMalang',
    'Cold brew kami direndam 18 jam menggunakan biji Arabika Toraja. Hasilnya? Rasa cokelat gelap, body tebal, dan kesegaran yang tidak bisa dilawan. Cocok untuk hari-hari panas di Malang. 🍫❄️ #ColdBrew',
    'Tempat terbaik untuk pertama kencan? Di sini. Suasana yang artistik, pencahayaan yang hangat, dan menu yang cukup untuk jadi topik obrolan. 🕯️ #DateIdea #Malang',
    'Workshop latte art bulan ini sudah dibuka. Belajar membuat pola daun, hati, dan rosetta bersama barista kami dalam waktu 2 jam. Daftar sekarang sebelum penuh! 🌿 #LatteArt #Workshop',
    'Tidak perlu ke Jakarta atau Bandung untuk menemukan kafe dengan konsep yang matang. Malang punya Ruang Rasa — dan kami bangga menjadi bagian dari kota ini. 🏙️ #ProudMalang'
  ]
),

(
  'Kopi Ampera Malang',
  'Warung kopi tua di tepi jalan raya Kepanjen. Sudah tiga generasi melayani pelanggan dengan kopi hitam murni dan jajanan pasar tradisional.',
  array['tenang', 'murah', 'outdoor'],
  '< Rp15.000',
  -8.1302,
  112.5614,
  'Jl. Raya Kepanjen No. 7, Kepanjen, Kab. Malang',
  'Kopi Ampera Malang adalah warung yang tidak pernah mencoba menjadi apa yang bukan dirinya. Tiga generasi menyeduh kopi dengan resep yang sama, melayani petani, pedagang, dan siapapun yang butuh jeda.',
  'Tiga generasi, satu racikan.',
  array[
    'Nenek saya yang memulai warung ini pada tahun 1971. Hari ini cucunya yang melanjutkan. Resepnya sama, semangatnya sama. Terima kasih Malang sudah setia selama ini. 🙏 #KopiAmpera #Legacy',
    'Kopi hitam Rp8.000. Tahu goreng Rp3.000. Duduk di bangku kayu sambil lihat kehidupan pagi hari Kepanjen. Pengalaman yang tidak bisa dibeli dengan uang banyak. ☕ #KopiMurah',
    'Para petani dari Turen dan Gondanglegi sering mampir ke sini sebelum ke pasar. Kalau kopi kami cukup baik untuk mereka yang bekerja keras, pasti cukup baik untuk semua orang. 🌾 #KopiPetani',
    'Jajanan pasar kami datang setiap pagi dari pasar Kepanjen. Klepon, cenil, getuk — semua ada. Sarapan paling lokal yang bisa kamu temukan di Malang selatan. 🍡 #JajanPasar',
    'Tidak ada wifi, tidak ada AC, tidak ada playlist Spotify. Yang ada hanya kopi yang diseduh dengan sepenuh hati dan bangku yang selalu punya ruang untuk kamu. ❤️ #SederhanaTapiEnak'
  ]
),

(
  'Pagi Sore Coffee',
  'Kafe dua lantai di jantung kota dengan balkon menghadap Jl. Ijen. Cocok untuk sarapan pagi sambil baca koran atau ngobrol sore yang tidak terburu-buru.',
  array['aesthetic', 'tenang', 'cozy', 'wifi kencang'],
  'Rp15.000 - Rp30.000',
  -7.9742,
  112.6265,
  'Jl. Ijen No. 17, Gading Kasri, Klojen, Malang',
  'Pagi Sore Coffee didesain untuk dua momen terbaik dalam sehari. Pagi yang pelan dengan kopi pour-over dan sarapan ringan. Sore yang panjang dengan kopi susu, teman baik, dan tidak ada agenda.',
  'Pagi yang pelan. Sore yang panjang.',
  array[
    'Balkon lantai dua kami menghadap langsung ke Jl. Ijen yang teduh. Pagi-pagi dengan cappuccino dan croissant di sini adalah hal yang kami rekomendasikan ke siapapun yang pertama ke Malang. 🥐☕ #PagiIjen',
    'Menu baru: Kopi Susu Vanilla Latte dengan susu oat pilihan sendiri. Ringan, creamy, dan ramah buat yang lactose intolerant. 🌿 #OatMilk #VanillaLatte',
    'Jam 7 pagi kami sudah buka dan balkon sudah siap ditempati. Tidak ada alasan untuk tidak memulai hari dengan baik. ☀️ #EarlyBird #PagiMalang',
    'Sore di Jl. Ijen adalah sore yang tidak terburu-buru. Angin sejuk, pohon yang rindang, kopi yang pas. Ajak siapapun ke sini dan obrolan pasti mengalir sendiri. 🌳 #SoreIjen',
    'Untuk kamu yang suka kerja dari kafe: kami punya meja panjang khusus di lantai satu dengan 12 colokan dan wifi dedicated. Tidak perlu rebutan. 💻 #WorkFromCafe #Malang'
  ]
),

(
  'Warung Kopi Mbah Slamet',
  'Warung kopi tenda di pinggir Stadion Gajayana yang sudah ada sejak 1985. Kopi joss khas Malang dan nasi bungkus tersedia dari subuh hingga tengah malam.',
  array['rame', 'murah', 'outdoor'],
  '< Rp15.000',
  -7.9893,
  112.6274,
  'Jl. Raya Gajayana, Ketawanggede, Lowokwaru, Malang',
  'Warung Kopi Mbah Slamet bukan sekadar warung — ini adalah penanda waktu. Selama hampir empat dekade, warung tenda ini menjadi saksi berbagai generasi anak Malang yang datang untuk ngobrol, merayakan kemenangan Arema, atau sekadar mengisi perut tengah malam.',
  'Sejak 1985, selalu ada untukmu.',
  array[
    'Kopi Joss kami dibuat dengan resep yang sama sejak Mbah Slamet pertama kali membuka tenda ini. Arang membara dicelupkan ke kopi hitam panas — rasanya harus dicoba sendiri untuk dipercaya. 🔥☕ #KopiJoss #MbahSlamet',
    'Kalau Arema menang, warung kami pasti penuh sampai subuh. Kami ikut merasakan tiap kemenangan dan tiap kekalahan bersama Aremania yang setia. 💙 #AremaFC #MalangBanget',
    'Nasi bungkus Rp8.000 sudah termasuk lauk, sayur, dan kerupuk. Murah bukan berarti tidak enak — pelanggan kami yang membuktikan setiap malam. 🍚 #NasiMurah #KopiMbah',
    'Buka jam 4 pagi sampai jam 1 dini hari. Kami ada untuk kamu yang pulang malam, yang mau berangkat subuh, dan yang tidak tahu mau ke mana tapi butuh kopi. 🌙 #WarungSetiap',
    'Sudah hampir 40 tahun dan belum ada rencana berhenti. Selama Malang masih butuh kopi dan obrolan, Warung Mbah Slamet akan terus ada. ❤️ #MbahSlamet #KopiMalang'
  ]
),

(
  'High Ground Coffee',
  'Specialty coffee bar di kawasan Tlogomas dengan fokus pada single origin Indonesia Timur. Barista bersertifikat SCA dengan metode penyeduhan yang terukur.',
  array['specialty', 'tenang', 'wifi kencang'],
  'Rp30.000 - Rp50.000',
  -7.9389,
  112.6075,
  'Jl. Tlogomas No. 34, Tlogomas, Lowokwaru, Malang',
  'High Ground Coffee adalah laboratorium rasa untuk penggemar kopi serius. Kami mengimpor langsung dari koperasi petani di Flores, Toraja, dan Papua — setiap lot dipilih karena keunikan karakternya, bukan sekadar brand.',
  'Dari ketinggian terbaik, untuk cangkir terbaik.',
  array[
    'Hari ini kami ada Arabika Papua Wamena yang baru tiba. Notes: markisa, floral, dengan keasaman cerah yang menyegarkan. Stok terbatas — datang sebelum kehabisan! 🌺☕ #PapuaWamena #SpecialtyCoffee',
    'Apa bedanya kopi specialty dengan kopi biasa? Datang ke High Ground dan kami akan jelaskan sambil kamu merasakannya sendiri. Gratis cupping setiap Jumat jam 3 sore. 🔬 #CuppingFriday',
    'Setiap biji yang kami gunakan punya skor Q-Grade di atas 85. Bukan sombong — kami cuma mau pastikan yang sampai ke cangkirmu memang layak untuk kamu. ✅ #QGrade #HighGround',
    'Espresso tonic kami: double shot Flores Bajawa, tonic water, jeruk lemon. Pahit, asam, segar, bold — semua dalam satu gelas. Minuman musim panas terbaik di Malang. 🍋 #EspressoTonic',
    'Kalau kamu mau belajar lebih dalam tentang kopi, kami ada kelas brewing setiap bulan. V60, AeroPress, hingga syphon — semua diajarkan dari dasar. DM untuk info lebih lanjut! 📚 #BrewingClass #Malang'
  ]
),

(
  'Kafe Titik Temu',
  'Kafe komunitas di Lowokwaru yang sering jadi venue diskusi, peluncuran buku, dan pertunjukan musik akustik. Kopi sambil berkontribusi untuk komunitas.',
  array['rame', 'cozy', 'aesthetic', 'wifi kencang'],
  'Rp15.000 - Rp30.000',
  -7.9311,
  112.6089,
  'Jl. Veteran No. 67, Sumbersari, Lowokwaru, Malang',
  'Kafe Titik Temu lahir dari keyakinan bahwa kafe yang baik adalah kafe yang memberi lebih dari sekadar minuman. Di sini, percakapan mendalam, ide-ide baru, dan koneksi antarmanusia adalah menu utama kami.',
  'Tempat ide bertemu, komunitas tumbuh.',
  array[
    'Jumat ini ada diskusi buku "Serat Centhini" bersama komunitas sastra Malang. Gratis, terbuka untuk umum, kopi diskon 20% untuk peserta. Sampai ketemu! 📖 #TitikTemu #DiskusiBuku',
    'Live music akustik setiap Sabtu malam jam 7. Musisi lokal Malang yang berbakat, suasana yang hangat, dan kopi yang selalu enak. Tidak ada tiket — cukup datang. 🎸 #LiveMusicMalang',
    'Kami percaya kafe adalah ruang publik yang sesungguhnya. Semua orang disambut — mahasiswa, pekerja, seniman, pensiunan. Kursi kami selalu ada untuk siapapun yang ingin duduk dan berpikir. ☕ #RuangPublik',
    'Kopi Kuntul kami — perpaduan Arabika Jawa dan sedikit Robusta Malang — adalah racikan yang kami buat khusus untuk merepresentasikan karakter kota ini. Kuat, hangat, tapi tidak berlebihan. 🏙️ #KopiKuntul',
    'Bulan ini 10% dari setiap pembelian minuman disumbangkan untuk program literasi anak di Kelurahan Sumbersari. Ngopi enak sambil berbuat baik — bisa banget di Titik Temu. 💚 #KopiUntukLiterasi'
  ]
),

(
  'Depot Kopi Doeloe',
  'Warung kopi nostalgia di Pakis dengan dekorasi jadul — radio tabung, poster film lama, dan kursi lipat rotan. Kopi tubruk dan teh poci yang autentik.',
  array['tenang', 'cozy', 'aesthetic'],
  'Rp15.000 - Rp30.000',
  -8.0021,
  112.7089,
  'Jl. Raya Pakis No. 55, Pakis, Kab. Malang',
  'Depot Kopi Doeloe adalah mesin waktu yang membawa kamu ke era 70-an. Setiap detail dipilih dengan cermat — dari radio tabung yang masih bisa menyala hingga gelas beling tebal yang sudah menjadi signature kami.',
  'Nostalgia dalam setiap tegukan.',
  array[
    'Gelas beling tebal, kopi tubruk yang diseduh langsung di gelas, dan gula batu di pinggirannya. Begini cara nenek moyang kita menikmati kopi, dan kami tidak mau mengubahnya. ☕ #KopiDoeloe #Nostalgia',
    'Radio tabung kami yang diproduksi tahun 1972 masih menyala dan memutar lagu keroncong setiap hari. Kalau kamu merindukannya, datanglah ke Pakis. 📻 #Radio #Keroncong',
    'Teh poci kami menggunakan teh melati asli dari Blitar, diseduh dalam teko tanah liat, dinikmati dalam suasana yang sama sekali tidak terburu-buru. 🍵 #TehPoci #Doeloe',
    'Tempat yang sempurna untuk bawa orang tua atau kakek nenek. Mereka yang datang ke sini sering bilang terasa "pulang ke kampung". Dan itu adalah pujian terbesar buat kami. 🏡 #NostalgiaKeluarga',
    'Snack jadul kami: roti bakar mentega, arem-arem, dan jadah goreng. Semua dimasak sendiri setiap pagi. Tidak ada yang beli dari luar — semua homemade. 🍞 #MakananJadul #Homemade'
  ]
),

(
  'Volta Coffee Malang',
  'Kafe modern di kawasan Araya dengan konsep coffee lab. Mesin espresso terbaru, nitrogen cold brew on tap, dan menu brunch yang tidak bikin bosan.',
  array['aesthetic', 'specialty', 'wifi kencang', 'adem'],
  '> Rp50.000',
  -7.9234,
  112.6723,
  'Jl. Araya Mansion Blok B2, Araya, Blimbing, Malang',
  'Volta Coffee Malang adalah ruang di mana teknologi bertemu tradisi. Kami percaya bahwa inovasi dalam kopi bukan tentang meninggalkan akar, tapi tentang membawa cita rasa ke level berikutnya.',
  'Kopi masa depan, rasa yang tak terlupakan.',
  array[
    'Nitrogen Cold Brew kami mengalir langsung dari tap — halus, creamy, dengan bubble nitrogen yang memberikan tekstur unik yang belum pernah kamu rasakan dari cold brew biasa. 🧪❄️ #NitroColdBrew #Volta',
    'Brunch menu baru sudah hadir! Avocado toast dengan espresso shot infused butter, eggs benedict dengan hollandaise kopi, dan granola bowl dengan cold brew. Weekend brunch terbaik di Malang. 🥑 #BrunchMalang',
    'Kami baru saja memasang mesin espresso Synesso MVP Hydra — mesin yang digunakan oleh juara barista dunia. Setiap shot yang keluar adalah hasil kalibrasi yang sangat presisi. ☕⚙️ #SpecialtyCoffee #Volta',
    'Coffee lab tour setiap Minggu jam 10 pagi. Lihat langsung proses roasting, ekstraksi, dan bagaimana kami mengontrol kualitas setiap lot biji yang masuk. Gratis untuk 10 pendaftar pertama! 🔬 #CoffeeLab',
    'Araya mungkin kawasan premium, tapi kami percaya kopi berkualitas harus bisa dinikmati siapapun yang menghargai prosesnya. Datang, rasakan, dan ceritakan kepada teman-temanmu. ✨ #VoltaMalang'
  ]
),

(
  'Kopi Kenangan Rakyat',
  'Warung kopi di tengah pasar Gadang yang menjadi titik kumpul pedagang dan warga sekitar sejak pagi buta. Kopi hitam, susu jahe, dan semangat gotong royong.',
  array['rame', 'murah', 'outdoor'],
  '< Rp15.000',
  -8.0058,
  112.6297,
  'Jl. Gadang No. 3, Gadang, Sukun, Malang',
  'Kopi Kenangan Rakyat adalah warung yang tumbuh bersama pasar Gadang. Setiap pagi, para pedagang, tukang becak, dan warga sekitar berkumpul di sini sebelum memulai hari. Kopi kami adalah benang yang merajut komunitas.',
  'Kopi rakyat, untuk semua.',
  array[
    'Jam 4 pagi warung kami sudah mulai melayani pedagang pasar yang mau memulai hari. Kopi hitam Rp7.000 adalah bahan bakar terbaik sebelum mengangkat barang dan melayani pembeli. 💪☕ #KopiPasar #PagiGadang',
    'Susu jahe kami adalah resep turun-temurun. Jahe segar, susu full cream, dan sedikit gula aren — hangat di dalam, semangat di luar. Cocok untuk pagi yang dingin di Malang. 🫚 #SusuJahe #HangatMalang',
    'Di sini tidak ada yang makan sendiri. Meja panjang kami selalu ramai dan percakapan selalu ada. Karena masyarakat Gadang memang sudah dari dulu gemar berbagi meja. 🤝 #GotongRoyong #KopiKenangan',
    'Menu paling dicari: nasi pecel dengan tempe goreng dan kopi hitam panas. Sarapan Rp15.000 yang sudah kenyang, sudah dapat energi, sudah dapat obrolan. Mana ada yang lebih baik? 🌿 #NasiPecel',
    'Kami tidak pernah tutup di hari libur nasional. Karena pasar tetap buka, pedagang tetap bekerja, dan mereka tetap butuh kopi. Kami ada untuk semua momen. ☕ #WarungSetia #Malang'
  ]
);
