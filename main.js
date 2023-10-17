import { userIcon } from "./helper.js";

//!HTML'den gelenler 
const form = document.querySelector("form");
const input = document.querySelector("form #title");
const cancelBtn = document.querySelector("form #cancel");
const noteList = document.querySelector("ul");

//! Ortak değişkenler
var map;
var coords = [];
var notes = [];
var markerLayer = [];

//! Olay izleyicileri
cancelBtn.addEventListener("click", () => {
    form.style.display = "none";
    clearForm();
})

// kullanıcının konumuna göre haritayı ekrana basma
function loadMap(coords) {
    //L, leaflet kütüphanesinin bir örneğidir. ve L dedikten sonra Leaflet kütüphanesinin içindeki
    //metotlara erişebiliyoruz. Haritada beni bir yere yönlendir, animasyon oluştur gibi,
    //belli bölgeyi çerçevele gibi  L.map haritayı ekrana basar. 9.satırdaki 3. map bizim
    //index'te oluşturduğumuz id'si map olana denk geliyor. ona maptan başka bir şey yazsaydık buna 
    //da aynısını yazmamız gerekirdi

    //setview haritayı sayfaya bastığımızda sayfanın konumunu belirliyor. Biz bunu güncelleyebiliriz
    //51 ile başlayan enlem, -0. ile başlayan boylam, 13 değeri zoom oranı(arttıkça zoom artar)

    // Haritanın kurulumu
    map = L.map('map').setView(coords, 10);

    // L.tilelayer ve devamı bizim haritamızla ilgili bilgiler. Türü vs fiziki coğrafya vs
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //L.marker ekrana imleç eklemeye yarayan fonksiyon(bu kısım londondan başlatır imleçi)
    // L.marker([51.5, -0.09]).addTo(map)
    //     .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    //     .openPopup();

    //imleçleri tutacağımız ayrı bir katman oluşturma
    markerLayer = L.layerGroup().addTo(map);
    // kullanıcının konumunu gösterme
    L.marker(coords, { icon: userIcon }).addTo(map)
        .bindPopup('Your Location!')

    //Haritadaki tıklanma olaylarını izler, addevent listenerla dinlemek mümkün değil
    //kütüphanede nasıl kullanılıyorsa öyle yaparız-leaflet 
    map.on("click", onMapClick)
}

//Formun gönderilmesini izleme
form.addEventListener("submit", (e) => {
    e.preventDefault();
    // formun içindeki değerlerine erişme
    const title = e.target[0].value;
    const date = e.target[1].value;
    const status = e.target[2].value;
    // notlar dizisine bu elemanı ekle
    notes.unshift({
        id: new Date().getTime(),
        title,
        date,
        status,
        coords,
    });
    //notları listele
    renderNoteList(notes)

    //formu kapat
    form.style.display = "none"
    clearForm();
});

// imleci ekrana basar(marker layer olan katmana ekliyoruz çnkü direkt haritaya eklese silme özelliği olmaz)
function renderMarker(item) {
    // imleç oluştur
    L.marker(item.coords)
    // imleci katmana ekle
    .addTo(markerLayer)
    // imlece pop-up ekle
    .bindPopup(item.title);
  
}

//note listesini ekrana basar
function renderNoteList(items) {
    // Eski elemanları temizleme
    noteList.innerHTML = "";
    // Eski imleçleri temizle-aşağıdaki clear layers metotu kütüphaneden geliyo-
    markerLayer.clearLayers();

    //Her bir eleman için ekrana basma fonk. çalıştır.
    items.forEach((ele) => {
        //li elemanı oluştur
        const listEle = document.createElement("li");
        //içeriğini belirleme
        listEle.innerHTML = ` 
        <li>
        <div>
          <p>${ele.title}</p>
          <p><span>Date: </span>${ele.date}</p>
          <p><span>Category: </span>${ele.status}</p>
        </div>
        <i id="fly" class="bi bi-airplane-fill"></i>
        <i id="delete" class="bi bi-trash3-fill"></i>
      </li>`;
        //HTML'deki listeye gönderme
        noteList.appendChild(listEle)
        //döngünün her adımında ekrana imleç bas
        renderMarker(ele)
    });
}

// kullanıcının konumunu isteme
navigator.geolocation.getCurrentPosition(
    // kullanınıcı izin veririrse harFfitayı
    // onun bulunduğu konumda aç
    (e) => loadMap([e.coords.latitude, e.coords.longitude]),
    // izin vermezse varsayılan konumda aç
    () => {
        loadMap([38.802424, 35.505317]);
    }
);

//haritaya tıklanınca çalışan fonk
const onMapClick = (e) => {
    //koordinatları ortak alana aktar
    coords = [e.latlng.lat, e.latlng.lng];
    // formu göster
    form.style.display = "flex";
    // kullanıcıyı bir inputa js tarafından odaklamak istiyorsak focus() fonk kullanılır
    input.focus();
};


//formu temizler
function clearForm() {
    form[0].value = "";
    form[1].value = "";
    form[2].value = "goto";
}