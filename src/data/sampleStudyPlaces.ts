import {StudyPlace} from './studyPlaces';

export const sampleStudyPlaces: StudyPlace[] = [
  {
    id: '1',
    name: 'Bayerische Staatsbibliothek',
    address: 'Ludwigstraße 16, 80539 München',
    whoCanUse: 'Herkes (18 yaş üstü, kimlik ibrazı gerekli)',
    openingHours: {
      monday: '08:00 - 24:00',
      tuesday: '08:00 - 24:00', 
      wednesday: '08:00 - 24:00',
      thursday: '08:00 - 24:00',
      friday: '08:00 - 24:00',
      saturday: '08:00 - 24:00',
      sunday: '10:00 - 24:00'
    },
    description: 'München\'ün en büyük kütüphanesi. Çok sessiz ortam, geniş masalar. Genelde sabah 9\'dan sonra dolmaya başlar, öğlen 12-14 arası çok yoğun. Ciddi ders çalışanlar için ideal.',
    restrictions: 'Üyelik gerekli (ücretsiz), kimlik ibrazı zorunlu. Çanta kontrolü var.',
    electricOutlets: true,
    electricOutletsPercentage: 85,
    foodOptions: 'Kütüphane içinde kafe mevcut, dışarıda çok sayıda restoran',
    coordinates: {
      lat: 48.1482,
      lng: 11.5802
    },
    distanceToGFZ: 25,
    distanceToMainCampus: 15,
    category: 'library',
    isQuiet: true,
    hasWifi: true,
    isFree: true
  },
  {
    id: '2', 
    name: 'TUM Hauptbibliothek',
    address: 'Arcisstraße 21, 80333 München',
    whoCanUse: 'TUM öğrencileri ve personeli, misafir kartı ile dışarıdan da kullanılabilir',
    openingHours: {
      monday: '08:00 - 24:00',
      tuesday: '08:00 - 24:00',
      wednesday: '08:00 - 24:00', 
      thursday: '08:00 - 24:00',
      friday: '08:00 - 20:00',
      saturday: '10:00 - 18:00',
      sunday: 'Kapalı'
    },
    description: 'TUM ana kampüsün merkezi kütüphanesi. Mühendislik odaklı kaynaKlar. Grup çalışma odaları mevcut. Sınav dönemlerinde çok yoğun.',
    restrictions: 'TUM kartı veya misafir kartı gerekli',
    electricOutlets: true,
    electricOutletsPercentage: 90,
    foodOptions: 'Kampüs içinde mensa ve kafeler',
    coordinates: {
      lat: 48.1497,
      lng: 11.5675
    },
    distanceToGFZ: 30,
    distanceToMainCampus: 5,
    category: 'university',
    isQuiet: true,
    hasWifi: true,
    isFree: true
  },
  {
    id: '3',
    name: 'Café Luitpold',
    address: 'Brienner Str. 11, 80333 München',
    whoCanUse: 'Herkes (müşteri olması beklenir)',
    openingHours: {
      monday: '08:00 - 19:00',
      tuesday: '08:00 - 19:00',
      wednesday: '08:00 - 19:00',
      thursday: '08:00 - 19:00',
      friday: '08:00 - 19:00',
      saturday: '09:00 - 19:00',
      sunday: '09:00 - 18:00'
    },
    description: 'Merkezi lokasyon, rahat atmosfer. Hafta içi öğleden önce sakin, öğleden sonra daha yoğun. Laptopla çalışanlar için uygun.',
    restrictions: 'Kahve/yiyecek siparişi beklenir, uzun süre oturmak için düzenli sipariş vermek gerekir',
    electricOutlets: true,
    electricOutletsPercentage: 60,
    foodOptions: 'Kahve, pasta, sandviç çeşitleri',
    coordinates: {
      lat: 48.1445,
      lng: 11.5718
    },
    distanceToGFZ: 20,
    distanceToMainCampus: 12,
    category: 'cafe',
    isQuiet: false,
    hasWifi: true,
    isFree: false
  },
  {
    id: '4',
    name: 'LMU Hauptbibliothek',
    address: 'Geschwister-Scholl-Platz 1, 80539 München',
    whoCanUse: 'LMU öğrencileri ve personeli, dışarıdan günlük kart alınabilir',
    openingHours: {
      monday: '09:00 - 24:00',
      tuesday: '09:00 - 24:00',
      wednesday: '09:00 - 24:00',
      thursday: '09:00 - 24:00',
      friday: '09:00 - 24:00',
      saturday: '09:00 - 20:00',
      sunday: '11:00 - 20:00'
    },
    description: 'LMU merkez kütüphanesi. Çok geniş, farklı çalışma alanları. Genelde 10\'dan sonra dolmaya başlar.',
    restrictions: 'LMU kartı veya günlük misafir kartı (3€) gerekli',
    electricOutlets: true,
    electricOutletsPercentage: 80,
    foodOptions: 'Yakınlarda çok sayıda restoran ve kafe',
    coordinates: {
      lat: 48.1500,
      lng: 11.5806
    },
    distanceToGFZ: 22,
    distanceToMainCampus: 18,
    category: 'university',
    isQuiet: true,
    hasWifi: true,
    isFree: false // Günlük kart ücretli
  },
  {
    id: '5',
    name: 'Starbucks Marienplatz',
    address: 'Marienplatz 26, 80331 München',
    whoCanUse: 'Herkes (müşteri olması beklenir)',
    openingHours: {
      monday: '06:30 - 21:00',
      tuesday: '06:30 - 21:00',
      wednesday: '06:30 - 21:00',
      thursday: '06:30 - 21:00',
      friday: '06:30 - 22:00',
      saturday: '07:00 - 22:00',
      sunday: '08:00 - 21:00'
    },
    description: 'Merkezi konum, çok yoğun. Turist ve alışverişçilerle dolu. Kısa süreli çalışma için uygun, uzun süre konsantrasyon zor.',
    restrictions: 'İçecek siparişi beklenir, masalar genelde 1-2 saat için uygun',
    electricOutlets: false,
    foodOptions: 'Starbucks menüsü - kahve, çay, snack',
    coordinates: {
      lat: 48.1374,
      lng: 11.5755
    },
    distanceToGFZ: 18,
    distanceToMainCampus: 15,
    category: 'cafe',
    isQuiet: false,
    hasWifi: true,
    isFree: false
  },
  {
    id: '6',
    name: 'Rocket Internet SE (Coworking)',
    address: 'Klenzstraße 57, 80469 München',
    whoCanUse: 'Üyelik gerekli veya günlük geçiş',
    openingHours: {
      monday: '24 saat',
      tuesday: '24 saat',
      wednesday: '24 saat',
      thursday: '24 saat',
      friday: '24 saat',
      saturday: '24 saat',
      sunday: '24 saat'
    },
    description: 'Modern coworking alanı. Genç profesyoneller ve startup çalışanları. Networking imkanı var.',
    restrictions: 'Aylık üyelik (150€) veya günlük geçiş (25€) gerekli',
    electricOutlets: true,
    electricOutletsPercentage: 95,
    foodOptions: 'Ücretsiz kahve/çay, yakınlarda restoranlar',
    coordinates: {
      lat: 48.1320,
      lng: 11.5643
    },
    distanceToGFZ: 25,
    distanceToMainCampus: 20,
    category: 'coworking',
    isQuiet: false,
    hasWifi: true,
    isFree: false
  }
];