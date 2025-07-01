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
  roomTypes: string[];
  applicationMethod: string;
  images?: string[];
}

export const mockDorms: Dorm[] = [
  {
    id: "1",
    name: "Apian Aparthaus",
    organization: "Apian",
    address: "Apianstraße 7, 85774 Unterföhring",
    rent: 1000,
    website: "https://apian-aparthaus.de/",
    coordinates: {
      lat: 48.1886,
      lng: 11.6541
    },
    distanceToGFZ: 40,
    distanceToMainCampus: 50,
    description: "Görece kolay yer bulunabilen ve son dakikada kalacak yer aramak zorunda kalan Türk öğrencilerin tercih ettiği bir yurt kampüsü Apian. Odalar geniş olsa da, kalanların odalarda başa çıkması zor küf sorunundan ve ilginç oda içi tasarımlarından (duş ile oda arasında pencere var) çok memnun olmadığı biliniyor. Yönetimin kira sözleşmesinden sonra ortaya çıkan sorunlarla ilgilenme konusundaki çekimserliği de bilindik. Çok dikkatli olarak, hatta önceden gidip odayı görerek taşınılmasında fayda var…",
    features: [
      "Geniş odalar",
      "Kolay yer bulma",
      "Son dakika seçeneği",
      "Kampüs ortamı"
    ],
    roomTypes: ["Stüdyo", "Apartman"],
    applicationMethod: "Online başvuru"
  },
  {
    id: "2",
    name: "AWO München - Haidpark (Fröttmaning)",
    organization: "AWO Vakfı",
    address: "Admiralbogen 37, 80939 München",
    rent: 327,
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
      "Kampüs ortamı",
      "Uygun fiyat"
    ],
    roomTypes: ["Stüdyo", "WG"],
    applicationMethod: "E-posta başvurusu"
  },
  {
    id: "3",
    name: "GLC (Garching Living Center)",
    organization: "GLC",
    address: "Einsteinstraße 3, 85748 Garching bei München",
    rent: 1170,
    website: "https://www.studentenwohnung-garching.de/mietanfrage/",
    coordinates: {
      lat: 48.2651,
      lng: 11.6719
    },
    distanceToGFZ: 12,
    distanceToMainCampus: 57,
    description: "Bir zamanlar ev arama konusunda bir miktar geç kalmış öğrencilerin sığınağı olan ve her daim yer bulunabilen GLC'de, bugünlerde diğer yurtlarda da hâkim olan yoğunluk söz konusu. Garching'deki bu yer, özellikle 'Garching'deki derslere sıkça giderim' diyenler için ideal. Münih'e inmek de yurdun U6 Garching durağına yakınlığından dolayı hiç de zor değil. Odaları ve ortak kullanım alanları istediğiniz her türlü lükse sahip, ancak kirası ortalamanın gayet üzerinde.",
    features: [
      "Lüks donanım",
      "U6 durağına yakın",
      "Garching kampüsüne ideal",
      "Her türlü imkan",
      "Ortak kullanım alanları"
    ],
    roomTypes: ["Lüks stüdyo", "Apartman"],
    applicationMethod: "Selbstauskunft formu"
  },
  {
    id: "4",
    name: "Irrenhauser & Seitz Markt Schwaben",
    organization: "Irrenhauser & Seitz",
    address: "Enzensbergerstraße 8, 85570 Markt Schwaben",
    rent: 700,
    website: "https://www.irrenhauser-seitz.de/project/mietwohnung-markt-schwaben-enzensberger-strasse-8/",
    coordinates: {
      lat: 48.1944,
      lng: 11.8708
    },
    distanceToGFZ: 75,
    distanceToMainCampus: 55,
    description: "Markt Schwaben S2 durağının hemen yanındaki bina olan bu yurt, içi yeni ve güzel yapılmış odaları içeriyor. Eyalet bölgesi olarak Münih değil de Ebersberg'e bağlı olduğu için oturum izni konuları yıldırım hızıyla halledilebiliyor. Ancak bu yurtla ilgili söylenebilecek her türlü olumlu şey bu noktada sonlanıyor. Yurtta sadece öğrencilerin değil, aynı zamanda sosyal yardım alan aile ve fertlerin de kalması; gürültü şikayeti durumunda yurt sorumlusunun kayıtsızlığa olan eğilimi ve şehirden bir hayli uzak olması birer handikap.",
    features: [
      "Yeni ve güzel odalar",
      "S2 durağına yakın",
      "Hızlı oturum işlemleri",
      "Karışık sakinler"
    ],
    roomTypes: ["Tek kişilik oda", "Apartman"],
    applicationMethod: "Manfred Prummer ile iletişim"
  },
  {
    id: "5",
    name: "SLC (Student Living Center)",
    organization: "SLC",
    address: "Freisinger Landstraße 45a, 85748 Garching bei München",
    rent: 890,
    website: "https://www.studentenwohnung-garching.de/mietanfrage/",
    coordinates: {
      lat: 48.2694,
      lng: 11.6583
    },
    distanceToGFZ: 7,
    distanceToMainCampus: 67,
    description: "GLC'nin ikiz binası SLC de GLC'ye çok benzer bir içerik sunuyor. Odaları çok talep görüyor, bu yüzden ne kadar erken başvurursanız o kadar iyi olacaktır. Önünden geçen otobüs sizi direkt olarak Garching kampüsüne ulaştırdığı için bina, en ideal konumlardan birinde diyebiliriz.",
    features: [
      "GLC ile benzer imkanlar",
      "Kampüse direkt otobüs",
      "İdeal konum",
      "Yüksek talep",
      "Modern donanım"
    ],
    roomTypes: ["Stüdyo", "Apartman"],
    applicationMethod: "Selbstauskunft formu"
  },
  {
    id: "6",
    name: "Stadt Dachau Studentenwohnheim",
    organization: "Stadt Dachau",
    address: "Max-Mannheimer Platz 4, 85221 Dachau",
    rent: 330,
    website: "https://studentenwohnheim-dachau.de",
    coordinates: {
      lat: 48.2583,
      lng: 11.4342
    },
    distanceToGFZ: 52,
    distanceToMainCampus: 50,
    description: "Dachau Belediyesi tarafından işletilen bu yurt sadece öğrencilere açıktır. Maalesef şu anda yalnızca bekleme listesine (Warteliste) kayıt yaptırmak mümkün. Dachau, Münih'e biraz uzak olsa da, Garching'e giden X201 otobüsüne Dachau Bahnhof'tan, ya da merkeze giden S2 trenine Dachau durağından ulaşabilirsiniz. Kiraları da oldukça uygun.",
    features: [
      "Sadece öğrenciler",
      "Uygun kiralar",
      "S2 ve X201 erişimi",
      "Belediye işletmesi",
      "Bekleme listesi"
    ],
    roomTypes: ["Tek kişilik oda", "WG"],
    applicationMethod: "Bekleme listesi kaydı"
  },
  {
    id: "7",
    name: "Studentenhaus Domino",
    organization: "Domino",
    address: "u. Straßäcker 21, 85748 Garching bei München",
    rent: 602,
    website: "http://www.studentenhaus-domino.de/startseite.htm",
    coordinates: {
      lat: 48.2576,
      lng: 11.6519
    },
    distanceToGFZ: 12,
    distanceToMainCampus: 67,
    description: "Garching'deki bir başka alternatif de Domino. Başvurularını posta yoluyla alıyor, bu yüzden istenen belgeleri eksiksiz doldurup A4 posta zarfı içinde internet sitesinde yazan adrese göndermeniz gerekiyor.",
    features: [
      "Garching'de konum",
      "Posta ile başvuru",
      "Öğrenci odaklı",
      "Kampüse yakın"
    ],
    roomTypes: ["Tek kişilik oda", "WG"],
    applicationMethod: "Posta ile başvuru"
  },
  {
    id: "8",
    name: "TUM Wohnungsbörse",
    organization: "TUM",
    address: "TUM Kampüsü, Various Locations, München",
    rent: 600,
    website: "https://living.tum.de/listings?viewMode=list",
    coordinates: {
      lat: 48.1497,
      lng: 11.5675
    },
    distanceToGFZ: 30,
    distanceToMainCampus: 10,
    description: "TUM çalışanlarının, öğrencilerinin ve ilişkili kişilerin ilan açmasına ve ilanlara bakmasına olanak sağlayan oluşum. TUM onaylı olduğu için insanın kaygılarını azaltıyor. TUM ile ilişkiniz yoksa bile bir arkadaşınız üzerinden ilanlara bakabilirsiniz.",
    features: [
      "TUM onaylı",
      "Güvenilir ilanlar",
      "Çeşitli seçenekler",
      "Üniversite bağlantısı"
    ],
    roomTypes: ["WG", "Stüdyo", "Apartman"],
    applicationMethod: "TUM hesabı ile online"
  },
  {
    id: "9",
    name: "Unity Alpha",
    organization: "Wohnen-in-Bayern",
    address: "Josef-Wirth-Weg 21, 80939 München",
    rent: 685,
    website: "https://wohnen-in-bayern.com/en",
    coordinates: {
      lat: 48.2142,
      lng: 11.6089
    },
    distanceToGFZ: 37,
    distanceToMainCampus: 52,
    description: "Wohnen-in-Bayern'in kampüslerinden Unity Alpha'da üniversite öğrencileri ve Azubiler (mesleki eğitim / çıraklık eğitimi alan öğrenciler) kalıyor. Genellikle dolu olan bu binaya başvurmak için Reservation Form'u doldurabilirsiniz. İki ayda bir de Contact Form doldurup durumla ilgili bilgi almakta fayda var. Oldukça temiz, düzenli ve kaliteli bir yaşam sunan – ve iyi konumda olan bu binanın kira bedelleri de düşük olduğu için talepleri karşılamakta zorlandığını biliyoruz.",
    features: [
      "Temiz ve düzenli",
      "Kaliteli yaşam",
      "İyi konum",
      "Düşük kira",
      "Öğrenci ve Azubi karışık"
    ],
    roomTypes: ["Tek kişilik oda", "WG"],
    applicationMethod: "Reservation Form"
  },
  {
    id: "10",
    name: "Unity Beta",
    organization: "Wohnen-in-Bayern",
    address: "Freisinger Landstraße 86-90, 80939 München",
    rent: 676,
    website: "https://wohnen-in-bayern.com/en",
    coordinates: {
      lat: 48.2158,
      lng: 11.6125
    },
    distanceToGFZ: 37,
    distanceToMainCampus: 52,
    description: "Wohnen-in-Bayern'in kampüslerinden Unity Beta'da üniversite öğrencileri ve Azubiler (mesleki eğitim / çıraklık eğitimi alan öğrenciler) kalıyor. Genellikle dolu olan bu binaya başvurmak için Reservation Form'u doldurabilirsiniz. İki ayda bir de Contact Form doldurup durumla ilgili bilgi almakta fayda var. Oldukça temiz, düzenli ve kaliteli bir yaşam sunan – ve iyi konumda olan bu binanın kira bedelleri de düşük olduğu için talepleri karşılamakta zorlandığını biliyoruz.",
    features: [
      "Temiz ve düzenli",
      "Kaliteli yaşam",
      "İyi konum",
      "Düşük kira",
      "Öğrenci ve Azubi karışık"
    ],
    roomTypes: ["Tek kişilik oda", "WG"],
    applicationMethod: "Reservation Form"
  },
  {
    id: "11",
    name: "UNIKUM",
    organization: "Wohnen-in-Bayern",
    address: "Lochhamer Str. 7, 82152 Planegg",
    rent: 648,
    website: "https://wohnen-in-bayern.com/en",
    coordinates: {
      lat: 48.1086,
      lng: 11.4286
    },
    distanceToGFZ: 85,
    distanceToMainCampus: 55,
    description: "Wohnen-in-Bayern'in kampüslerinden UNIKUM'da üniversite öğrencileri ve Azubiler (mesleki eğitim / çıraklık eğitimi alan öğrenciler) kalıyor. Genellikle dolu olan bu binaya başvurmak için Reservation Form'u doldurabilirsiniz. İki ayda bir de Contact Form doldurup durumla ilgili bilgi almakta fayda var. Oldukça temiz, düzenli ve kaliteli bir yaşam sunan bu binanın kira bedelleri de düşük olduğu için talepleri karşılamakta zorlandığını biliyoruz. Ancak Unikum diğer Unity kampüslerinden farklı olarak merkeze daha uzak konumda.",
    features: [
      "Temiz ve düzenli",
      "Kaliteli yaşam",
      "Düşük kira",
      "Öğrenci ve Azubi karışık",
      "Merkeze uzak"
    ],
    roomTypes: ["Tek kişilik oda", "WG"],
    applicationMethod: "Reservation Form"
  },
  {
    id: "12",
    name: "WOB Immobilien - Karl-Marx Ring 46 (Home Base München)",
    organization: "WOB Immobilien",
    address: "Karl-Marx-Ring 46, 81735 München",
    rent: 600,
    website: "https://projekte.wobimmo.com/home-base-muenchen/units",
    coordinates: {
      lat: 48.1125,
      lng: 11.6542
    },
    distanceToGFZ: 72,
    distanceToMainCampus: 47,
    description: "Bina, müteahhidi tarafından öğrencilere kiralanan dairelerden oluşuyor. İçerisinde bulaşık makinesinin bulunması, ek bir avantaj. Genellikle en az bir daire için kiracı arayışı oluyor. Kira bedelleri ise bölge ortalamasının oldukça altında. Ulaşım açısından, bina yalnızca U5 hattındaki Quiddestraße durağına yakın. Bazı otobüs hatları da var ancak ulaşım genel olarak U5 harici biraz sınırlı olabiliyor, bu da kampüslere erişimi zaman zaman zorlaştırabilir. Bunun dışında bina oldukça temiz ve düzenli; genel olarak öğrenciler için uygun bir yaşam alanı sunuyor.",
    features: [
      "Bulaşık makinesi",
      "Temiz ve düzenli",
      "Uygun kira",
      "U5 durağına yakın",
      "Sınırlı ulaşım"
    ],
    roomTypes: ["Apartman", "WG"],
    applicationMethod: "Online başvuru"
  },
  {
    id: "13",
    name: "Zimmerei",
    organization: "Die Zimmerei",
    address: "Resi-Huber-Platz 1, 81371 München",
    rent: 950,
    website: "https://zimmerei.apartments/wohnung-mieten-muenchen/",
    coordinates: {
      lat: 48.1158,
      lng: 11.5475
    },
    distanceToGFZ: 65,
    distanceToMainCampus: 32,
    description: "Die Zimmerei, U3 Brudermühlstraße'ye çok yakın, yani şehirle olan toplu taşıma bağlantısı çok iyi. İstediğiniz apartman genişliğini seçip 'Jetzt Mieten' dedikten sonra, sitenin istediği adımları takip ederek başvurunuzu tamamlayabilirsiniz. Ortalama üzeri kiralarına rağmen çok rağbet gördüğünden dolayı, başvuru kabul şansını artırmak adına erken başvurmanız tavsiye edilir…",
    features: [
      "U3 durağına yakın",
      "İyi toplu taşıma bağlantısı",
      "Çeşitli apartman büyüklükleri",
      "Yüksek talep",
      "Modern olanaklar"
    ],
    roomTypes: ["Stüdyo", "Apartman", "WG"],
    applicationMethod: "Online başvuru"
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
