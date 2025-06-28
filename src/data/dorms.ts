export interface Dorm {
  id: string;
  name: string;
  organization: string;
  address: string;
  rent: number;
  website: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceToGFZ: number; // minutes
  distanceToMainCampus: number; // minutes
  description: string;
  features: string[];
  requirements: string[];
  waitingTime: string;
  roomTypes: string[];
  applicationMethod: string;
  images?: string[];
}

export const mockDorms: Dorm[] = [
  {
    id: "1",
    name: "AWO München - Haidpark (Fröttmaning)",
    organization: "AWO Vakfı",
    address: "Admiralbogen 37, 80939 München",
    rent: 327.50,
    website: "https://awo-muenchen.de/spezielles/studentisches-wohnen-im-haidpark/ueber-uns",
    coordinates: {
      lat: 48.2094,
      lng: 11.6248
    },
    distanceToGFZ: 14,
    distanceToMainCampus: 46,
    description: "AWO Vakfı tarafından öğrencilere kiralanan dairelerin bulunduğu bir kampüstür. Başvuru yapabilmek için ailenizin geliri Bafög sınırını aşmamalı ve 30 yaşını doldurmamış olmalısınız. Daire seçenekleri arasında mutfağı ve banyosu içinde olan stüdyo daireler ile ortak kullanımlı (WG) daireler yer alıyor. Kira bedelleri oldukça uygun olduğu için talep çok yüksek. Şu an için yalnızca e-posta yoluyla başvuru kabul ediliyor. Ancak yoğun talep nedeniyle genellikle 3 okul dönemini aşan bir bekleme süresi bulunuyor. Hatta bazen, 'Bekleyen çok kişi var, sizi listeye dahi alamıyoruz' şeklinde cevaplar gelebiliyor. Yine de bu uygun koşullar göz önüne alındığında başvurmak denemeye değer.",
    features: [
      "Stüdyo daireler",
      "WG daireleri",
      "Kendi mutfağı",
      "Kendi banyosu",
      "Kampüs ortamı"
    ],
    requirements: [
      "Aile geliri Bafög sınırını aşmamalı",
      "30 yaşını doldurmamış olma",
      "Öğrenci statüsü"
    ],
    waitingTime: "3+ okul dönemi",
    roomTypes: ["Stüdyo", "WG"],
    applicationMethod: "E-posta"
  },
  {
    id: "2",
    name: "Studentenwerk München - Olympiadorf",
    organization: "Studentenwerk München",
    address: "Helene-Mayer-Ring 9, 80809 München",
    rent: 295.00,
    website: "https://www.studentenwerk-muenchen.de/wohnen/wohnheime/olympiadorf/",
    coordinates: {
      lat: 48.1761,
      lng: 11.5527
    },
    distanceToGFZ: 25,
    distanceToMainCampus: 30,
    description: "1972 Olimpiyat Köyü'nde yer alan tarihi bir yurt kompleksi. Münih'in kuzeyinde, doğa ile iç içe bir kampüs atmosferi sunuyor. Çok çeşitli oda seçenekleri ve ortak alanları ile popüler bir seçenek. Başvuru için Studentenwerk'in online sistemini kullanmanız gerekiyor.",
    features: [
      "Tarihi olimpiyat köyü",
      "Doğa ile iç içe",
      "Ortak mutfak",
      "Çamaşırhane",
      "Bisiklet park alanı",
      "Spor alanları"
    ],
    requirements: [
      "Münih üniversitelerinde kayıtlı olma",
      "Online başvuru",
      "Gelir belgesi"
    ],
    waitingTime: "2-4 semester",
    roomTypes: ["Tek kişilik oda", "İki kişilik oda", "WG"],
    applicationMethod: "Online portal"
  },
  {
    id: "3",
    name: "Katholische Hochschulgemeinde - Wohnheim",
    organization: "KHG",
    address: "Leopoldstraße 11, 80802 München",
    rent: 380.00,
    website: "https://www.khg-muenchen.de/wohnen/",
    coordinates: {
      lat: 48.1486,
      lng: 11.5804
    },
    distanceToGFZ: 35,
    distanceToMainCampus: 15,
    description: "Şehir merkezine yakın, Leopoldstraße üzerinde bulunan KHG yurdu. Dini bir topluluk tarafından işletilmesine rağmen, tüm öğrencilere açık. Küçük bir topluluk atmosferi ve merkezi konum avantajı sunuyor. Düzenli sosyal etkinlikler ve topluluk yaşamı öne çıkan özellikler.",
    features: [
      "Merkezi konum",
      "Küçük topluluk",
      "Sosyal etkinlikler",
      "Ortak mutfak",
      "Çalışma odaları",
      "Kütüphane"
    ],
    requirements: [
      "Üniversite öğrencisi olma",
      "Mülakat",
      "Topluluk yaşamına katılım isteği"
    ],
    waitingTime: "1-2 semester",
    roomTypes: ["Tek kişilik oda"],
    applicationMethod: "Başvuru formu + Mülakat"
  },
  {
    id: "4",
    name: "CVJM Studentenwohnheim",
    organization: "CVJM München",
    address: "Landwehrstraße 15, 80336 München",
    rent: 420.00,
    website: "https://www.cvjm-muenchen.org/wohnen/",
    coordinates: {
      lat: 48.1351,
      lng: 11.5820
    },
    distanceToGFZ: 40,
    distanceToMainCampus: 20,
    description: "Hauptbahnhof'a yürüme mesafesinde, şehir merkezinde yer alan modern yurt. Ulaşım açısından çok avantajlı konumda. Küçük ama verimli odalar ve güçlü topluluk ruhu. Hristiyan değerler etrafında şekillenmesine rağmen tüm inançlardan öğrencilere açık.",
    features: [
      "Merkezi konum",
      "Modern olanaklar",
      "Ulaşım kolaylığı",
      "Topluluk etkinlikleri",
      "Çalışma alanları",
      "WiFi"
    ],
    requirements: [
      "Öğrenci belgesi",
      "Kişisel mülakat",
      "Referans mektubu"
    ],
    waitingTime: "6 ay - 1 yıl",
    roomTypes: ["Tek kişilik oda", "Stüdyo"],
    applicationMethod: "Online başvuru + Mülakat"
  },
  {
    id: "5",
    name: "Studentenstadt Freimann",
    organization: "Studentenwerk München",
    address: "Christoph-Probst-Straße 10, 80805 München",
    rent: 280.00,
    website: "https://www.studentenwerk-muenchen.de/wohnen/wohnheime/studentenstadt-freimann/",
    coordinates: {
      lat: 48.1875,
      lng: 11.6090
    },
    distanceToGFZ: 20,
    distanceToMainCampus: 35,
    description: "Münih'in en büyük öğrenci komplekslerinden biri. 2500'den fazla öğrenciye ev sahipliği yapıyor. Kendi içinde bir şehir gibi, market, restoran, spor alanları mevcut. Sosyal yaşam çok aktif, çok çeşitli etkinlikler düzenleniyor. U-Bahn ile kampüslere kolay ulaşım.",
    features: [
      "Büyük kompleks",
      "Market ve restoran",
      "Spor alanları",
      "Aktif sosyal yaşam",
      "U-Bahn bağlantısı",
      "Çamaşırhane",
      "Kafe ve bar"
    ],
    requirements: [
      "Münih üniversitelerinde kayıt",
      "Online başvuru sistemi",
      "Bekleme listesine kayıt"
    ],
    waitingTime: "3-6 semester",
    roomTypes: ["Tek kişilik oda", "WG", "Apartman"],
    applicationMethod: "Studentenwerk online portal"
  },
  {
    id: "6",
    name: "Wohnheim St. Maximilian",
    organization: "Katholische Hochschulgemeinde",
    address: "Kaulbachstraße 31a, 80539 München",
    rent: 350.00,
    website: "https://www.st-maximilian.de/",
    coordinates: {
      lat: 48.1520,
      lng: 11.5890
    },
    distanceToGFZ: 30,
    distanceToMainCampus: 12,
    description: "Schwabing bölgesinde, üniversiteye çok yakın konumda yer alan geleneksel yurt. Küçük bir topluluk halinde yaşam, düzenli yemekler ve güçlü akademik destek sistemi. Özellikle yeni gelen öğrenciler için mentörlük programları mevcut.",
    features: [
      "Üniversiteye yakın",
      "Topluluk yemekleri",
      "Mentörlük programı",
      "Çalışma grupları",
      "Bahçe alanı",
      "Müzik odası"
    ],
    requirements: [
      "Üniversite öğrencisi",
      "Topluluk yaşamına uyum",
      "Başvuru mektubu",
      "Referanslar"
    ],
    waitingTime: "1 semester",
    roomTypes: ["Tek kişilik oda"],
    applicationMethod: "Yazılı başvuru + Görüşme"
  },
  {
    id: "7",
    name: "Wohnanlage Biederstein",
    organization: "Studentenwerk München",
    address: "Biedersteiner Straße 29, 80802 München",
    rent: 315.00,
    website: "https://www.studentenwerk-muenchen.de/wohnen/wohnheime/biederstein/",
    coordinates: {
      lat: 48.1621,
      lng: 11.5895
    },
    distanceToGFZ: 25,
    distanceToMainCampus: 18,
    description: "Englischer Garten'a çok yakın, sakin bir bölgede yer alan yurt kompleksi. Doğa yürüyüşleri ve açık hava aktiviteleri için ideal konum. Modern renovasyonlarla güncellenmiş odalar ve ortak alanlar. Özellikle doğa seven öğrenciler için mükemmel seçenek.",
    features: [
      "Englischer Garten yakını",
      "Sakin bölge",
      "Renovasyonlu",
      "Bisiklet park yeri",
      "Ortak balkonlar",
      "Çalışma alanları"
    ],
    requirements: [
      "Münih üniversite kaydı",
      "Online başvuru",
      "Bekleme listesi kaydı"
    ],
    waitingTime: "2-3 semester",
    roomTypes: ["Tek kişilik oda", "Stüdyo"],
    applicationMethod: "Studentenwerk sistemi"
  },
  {
    id: "8",
    name: "Internationales Wohnheim",
    organization: "TUM International",
    address: "Gabelsbergerstraße 35, 80333 München",
    rent: 450.00,
    website: "https://www.tum.de/en/studies/international-students/housing/",
    coordinates: {
      lat: 48.1467,
      lng: 11.5647
    },
    distanceToGFZ: 38,
    distanceToMainCampus: 8,
    description: "TUM tarafından özel olarak uluslararası öğrenciler için düzenlenmiş yurt. Çok kültürlü bir ortam, networking imkanları ve özel sosyal programlar. İngilizce dil desteği ve oryantasyon programları mevcut. Merkezi konumda, tüm şehir imkanlarına kolay erişim.",
    features: [
      "Uluslararası topluluk",
      "İngilizce destek",
      "Networking etkinlikleri",
      "Oryantasyon programı",
      "Modern olanaklar",
      "24/7 resepsiyon",
      "Ortak çalışma alanları"
    ],
    requirements: [
      "TUM öğrencisi olma",
      "Uluslararası öğrenci statüsü",
      "İngilizce/Almanca yeterlilik",
      "Özel başvuru formu"
    ],
    waitingTime: "6 ay - 1 yıl",
    roomTypes: ["Tek kişilik oda", "WG"],
    applicationMethod: "TUM Housing Office"
  }
];

export const dormFeatures = [
  "Stüdyo daireler",
  "WG daireleri", 
  "Kendi mutfağı",
  "Kendi banyosu",
  "Ortak mutfak",
  "Çamaşırhane",
  "WiFi",
  "Spor alanları",
  "Sosyal etkinlikler",
  "Çalışma odaları",
  "Kütüphane",
  "Bisiklet park yeri",
  "Market yakını",
  "Ulaşım kolaylığı"
];

export const locations = [
  "Fröttmaning",
  "Olympiadorf", 
  "Schwabing",
  "Stadtmitte",
  "Freimann",
  "Biederstein",
  "Maxvorstadt"
];
